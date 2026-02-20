import { useEffect, useMemo, useState } from 'react';
import { tableDataLoader } from '@/services';
import { getPACSLACScore } from '@/components/ui/forms/PACSLACScale';

const DEFAULT_EMPTY_VALUE = '—';

const ensureString = (value) => {
  if (value === null || value === undefined) return DEFAULT_EMPTY_VALUE;
  if (typeof value === 'string') return value;
  return String(value);
};

// Champs boolean : affichés comme case à cocher dans les formulaires, formatés Oui/Non dans le résumé et les constats
const formatBoolean = (value) => (value ? 'Oui' : 'Non');

const forEachInCollection = (collection, callback) => {
  if (!collection) return;
  if (Array.isArray(collection)) {
    collection.forEach(callback);
  } else if (typeof collection === 'object') {
    Object.entries(collection).forEach(([key, value]) => {
      callback(value, key);
    });
  }
};

const registerMeta = (accumulator, id, data = {}) => {
  if (!id) return;
  const existing = accumulator[id] || {};
  accumulator[id] = {
    ...existing,
    ...data,
    id,
  };
};

const mergeOptionMaps = (meta = {}, element, accumulator) => {
  if (!element || !Array.isArray(element.options)) return meta;

  const optionsMap = meta.optionsMap ? { ...meta.optionsMap } : {};
  const optionDescriptions = meta.optionDescriptions ? { ...meta.optionDescriptions } : {};

  element.options.forEach((option) => {
    const optionValue = option.value ?? option.id;
    if (optionValue === undefined) return;
    optionsMap[optionValue] = option.label || option.title || optionValue;
    if (option.description) {
      optionDescriptions[optionValue] = option.description;
    }
    if (Array.isArray(option.additional_fields)) {
      option.additional_fields.forEach((field) => populateElementMetadata(field, accumulator));
    }
    if (Array.isArray(option.followup_questions)) {
      option.followup_questions.forEach((question) => populateElementMetadata(question, accumulator));
    }
  });

  return {
    ...meta,
    optionsMap,
    optionDescriptions,
  };
};

const populateElementMetadata = (element, accumulator) => {
  if (!element || typeof element !== 'object') return;

  if (element.id) {
    registerMeta(accumulator, element.id, {
      label: element.label || element.title || element.name || element.id,
      description: element.description || element.help || null,
      type: element.type || element.ui?.component || null,
    });
    accumulator[element.id] = mergeOptionMaps(accumulator[element.id], element, accumulator);
  }

  if (element.element_id) {
    registerMeta(accumulator, element.element_id, {
      label: element.label || accumulator[element.element_id]?.label || element.element_id,
      description: element.description || accumulator[element.element_id]?.description || null,
      type: element.type || accumulator[element.element_id]?.type || element.ui?.component || null,
    });
    accumulator[element.element_id] = mergeOptionMaps(accumulator[element.element_id], element, accumulator);
  }

  if (Array.isArray(element.options)) {
    element.options.forEach((option) => {
      if (option.id) {
        registerMeta(accumulator, option.id, {
          label: option.label || option.id,
          description: option.description || null,
        });
      }
    });
  }

  const propagateCollection = (collection) => {
    forEachInCollection(collection, (child) => populateElementMetadata(child, accumulator));
  };

  propagateCollection(element.elements);
  propagateCollection(element.additional_fields);
  propagateCollection(element.complementary_fields);
  propagateCollection(element.additional_tracts);
  propagateCollection(element.subquestions);

  if (element.conditional_questions && typeof element.conditional_questions === 'object') {
    const conditional = element.conditional_questions;
    if (Array.isArray(conditional.questions)) {
      conditional.questions.forEach((question) => populateElementMetadata(question, accumulator));
    }
  }

  if (Array.isArray(element.followup_questions)) {
    element.followup_questions.forEach((question) => populateElementMetadata(question, accumulator));
  }

  if (Array.isArray(element.sub_blocks)) {
    element.sub_blocks.forEach((block) => {
      registerMeta(accumulator, block.id || block.element_id, {
        label: block.title || block.label || block.id,
        description: block.description || null,
        type: block.type || 'group',
      });
      populateElementMetadata(block, accumulator);
    });
  }

  if (Array.isArray(element.questions)) {
    element.questions.forEach((question) => populateElementMetadata(question, accumulator));
  }
};

const processBlock = (block, key, accumulator) => {
  if (!block || typeof block !== 'object') return;
  const blockId = block.id || key;
  registerMeta(accumulator, blockId, {
    label: block.title || block.label || blockId,
    description: block.description || null,
    type: block.type || 'group',
  });
  populateElementMetadata(block, accumulator);

  if (block.measurements) {
    forEachInCollection(block.measurements, (measurement) => {
      if (!measurement) return;
      registerMeta(accumulator, measurement.id, {
        label: measurement.label || measurement.id,
        description: measurement.description || measurement.help || null,
        unit: measurement.unit || null,
        type: measurement.type || 'measurement',
      });
      populateElementMetadata(measurement, accumulator);
    });
  }

  if (block.calculation && block.calculation.output_fields) {
    Object.entries(block.calculation.output_fields).forEach(([fieldId, fieldLabel]) => {
      registerMeta(accumulator, fieldId, {
        label: fieldLabel || fieldId,
        type: 'calculated',
      });
    });
  }

  if (block.results) {
    forEachInCollection(block.results, (result) => {
      registerMeta(accumulator, result.id, {
        label: result.label || result.id,
        description: result.description || null,
        type: result.type || 'calculated',
      });
      populateElementMetadata(result, accumulator);
    });
  }

  if (block.elements) {
    forEachInCollection(block.elements, (element) => populateElementMetadata(element, accumulator));
  }

  if (block.sub_blocks) {
    forEachInCollection(block.sub_blocks, (subBlock, subKey) => processBlock(subBlock, subKey, accumulator));
  }
};

const collectMetadataFromSchema = (schema) => {
  const accumulator = {};

  if (!schema) return accumulator;

  forEachInCollection(schema.elements, (element) => populateElementMetadata(element, accumulator));
  forEachInCollection(schema.sub_blocks, (block, key) => processBlock(block, key, accumulator));
  forEachInCollection(schema.blocks, (block, key) => processBlock(block, key, accumulator));
  forEachInCollection(schema.questions, (question) => populateElementMetadata(question, accumulator));
  forEachInCollection(schema.additional_fields, (field) => populateElementMetadata(field, accumulator));
  forEachInCollection(schema.measurements, (measurement) => {
    registerMeta(accumulator, measurement.id, {
      label: measurement.label || measurement.id,
      description: measurement.description || measurement.help || null,
      unit: measurement.unit || null,
      type: measurement.type || 'measurement',
    });
    populateElementMetadata(measurement, accumulator);
  });

  if (schema.calculation && schema.calculation.output_fields) {
    Object.entries(schema.calculation.output_fields).forEach(([fieldId, fieldLabel]) => {
      registerMeta(accumulator, fieldId, {
        label: fieldLabel || fieldId,
        type: 'calculated',
      });
    });
  }

  if (schema.results) {
    forEachInCollection(schema.results, (result) => {
      registerMeta(accumulator, result.id, {
        label: result.label || result.id,
        description: result.description || null,
        type: result.type || 'calculated',
      });
      populateElementMetadata(result, accumulator);
    });
  }

  // Sous-questions (ex. table 12 – détails douleur : C1T12Q1, C1T12Q2, …) pour résumé et constats
  if (Array.isArray(schema.subquestions)) {
    schema.subquestions.forEach((sq) => {
      const key = sq.qid || sq.id;
      if (key) {
        registerMeta(accumulator, key, {
          label: sq.label || key,
          description: sq.description || sq.ui?.help || null,
          type: sq.type || sq.ui?.component || null,
        });
        accumulator[key] = mergeOptionMaps(accumulator[key] || {}, sq, accumulator);
      }
    });
  }

  return accumulator;
};

const formatArrayValue = (value, meta, metaIndex) => {
  if (!Array.isArray(value) || value.length === 0) return DEFAULT_EMPTY_VALUE;
  const formatted = value
    .map((item) => {
      const itemMeta = typeof item === 'string' ? (metaIndex[item] || meta) : meta;
      return formatAnswerValue(item, itemMeta, metaIndex);
    })
    .filter((entry) => entry && entry !== DEFAULT_EMPTY_VALUE);
  return formatted.length > 0 ? formatted.join(', ') : DEFAULT_EMPTY_VALUE;
};

const formatObjectWithCheckedText = (value) => {
  const parts = [];
  if (typeof value.checked === 'boolean') {
    parts.push(formatBoolean(value.checked));
  }
  if (value.text) {
    parts.push(value.text);
  }
  return parts.length > 0 ? parts.join(' — ') : DEFAULT_EMPTY_VALUE;
};

const formatScaleObject = (value, metaIndex) => {
  if (!value || typeof value !== 'object') return DEFAULT_EMPTY_VALUE;
  const parts = [];

  if (value.totalScore !== undefined) {
    parts.push(`Score total : ${value.totalScore}`);
  }
  if (value.riskLevel !== undefined) {
    let riskLabel = value.riskLevel;
    if (riskLabel && typeof riskLabel === 'object') {
      const riskParts = [];
      if (riskLabel.level || riskLabel.label || riskLabel.title) {
        riskParts.push(riskLabel.label || riskLabel.title || riskLabel.level);
      }
      if (riskLabel.description) {
        riskParts.push(riskLabel.description);
      }
      riskLabel = riskParts.join(' — ') || JSON.stringify(riskLabel);
    }
    parts.push(`Risque : ${ensureString(riskLabel)}`);
  }
  if (value.interpretation) {
    parts.push(`Interprétation : ${value.interpretation}`);
  }

  if (value.selections && typeof value.selections === 'object') {
    const selectionLines = Object.entries(value.selections).map(([key, val]) => {
      const optionMeta = metaIndex[key] || {};
      return `• ${optionMeta.label || key} : ${formatAnswerValue(val, optionMeta, metaIndex)}`;
    });
    if (selectionLines.length > 0) {
      parts.push(selectionLines.join('\n'));
    }
  }

  const remainingKeys = Object.keys(value).filter((key) => !['totalScore', 'riskLevel', 'interpretation', 'selections'].includes(key));
  remainingKeys.forEach((key) => {
    const nestedMeta = metaIndex[key] || {};
    parts.push(`${key} : ${formatAnswerValue(value[key], nestedMeta, metaIndex)}`);
  });

  return parts.length > 0 ? parts.join('\n') : DEFAULT_EMPTY_VALUE;
};

const formatAnswerValue = (value, meta = {}, metaIndex = {}) => {
  if (value === null || value === undefined || value === '') return DEFAULT_EMPTY_VALUE;

  if (typeof value === 'boolean') {
    return formatBoolean(value);
  }

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (meta.optionsMap && meta.optionsMap[normalized] !== undefined) {
      const optionLabel = meta.optionsMap[normalized];
      const optionDescription = meta.optionDescriptions?.[normalized];
      return optionDescription ? `${optionLabel} — ${optionDescription}` : optionLabel;
    }
    const fallbackMeta = metaIndex && metaIndex[normalized];
    if (fallbackMeta) {
      if (fallbackMeta.description && fallbackMeta.description !== fallbackMeta.label) {
        return `${fallbackMeta.label} — ${fallbackMeta.description}`;
      }
      return fallbackMeta.label || normalized;
    }
    const lower = normalized.toLowerCase();
    if (lower === 'yes') return 'Oui';
    if (lower === 'no') return 'Non';
    return normalized;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return DEFAULT_EMPTY_VALUE;
    const formatted = String(value);
    return meta.unit ? `${formatted} ${meta.unit}` : formatted;
  }

  if (Array.isArray(value)) {
    return formatArrayValue(value, meta, metaIndex);
  }

  if (typeof value === 'object') {
    if (value.label) {
      const labelText = ensureString(value.label);
      if (value.description && value.description !== value.label) {
        return `${labelText} — ${value.description}`;
      }
      return labelText;
    }
    if ('checked' in value || 'text' in value) {
      return formatObjectWithCheckedText(value);
    }
    if ('totalScore' in value || 'riskLevel' in value || 'selections' in value) {
      return formatScaleObject(value, metaIndex);
    }
    // Objet PACSLAC (détails douleur table 12) : afficher le score
    if (meta.type === 'pacslac_scale' || (meta.label && String(meta.label).includes('PACSLAC'))) {
      const score = getPACSLACScore(value);
      return `Score : ${score}`;
    }

    const entries = Object.entries(value).map(([key, nestedValue]) => {
      const nestedMeta = metaIndex[key] || {};
      const formattedNested = formatAnswerValue(nestedValue, nestedMeta, metaIndex);
      return `${nestedMeta.label || key} : ${formattedNested}`;
    });

    return entries.length > 0 ? entries.join('\n') : DEFAULT_EMPTY_VALUE;
  }

  return DEFAULT_EMPTY_VALUE;
};

const mergeProvidedLabels = (metaIndex, providedLabels = {}) => {
  const updatedMeta = { ...metaIndex };

  Object.entries(providedLabels).forEach(([fieldId, labelData]) => {
    updatedMeta[fieldId] = {
      ...(updatedMeta[fieldId] || {}),
      id: fieldId,
      label: labelData.label || updatedMeta[fieldId]?.label || fieldId,
      description: labelData.description || updatedMeta[fieldId]?.description || null,
    };
  });

  return updatedMeta;
};

const useEvaluationSummaryFormatter = ({ tables = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formattedTables, setFormattedTables] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    const processTables = async () => {
      if (!tables || tables.length === 0) {
        setFormattedTables([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const results = [];

        for (const table of tables) {
          try {
            if (table.id === 'BWAT') {
              const labels = table.labels || { total: 'Score total', status: 'Statut' };
              const entries = Object.entries(table.answers || {}).map(([fieldId, rawValue]) => ({
                id: fieldId,
                label: labels[fieldId] || fieldId,
                description: null,
                value: rawValue != null && rawValue !== '' ? String(rawValue) : '—',
                rawValue,
              }));
              results.push({
                id: table.id,
                title: table.title || 'Score BWAT – Continuum du statut de la plaie',
                description: table.description || null,
                order: table.order ?? 26.5,
                entries,
              });
              continue;
            }

            const schema = await tableDataLoader.loadTableData(table.id);
            let metaIndex = collectMetadataFromSchema(schema);
            metaIndex = mergeProvidedLabels(metaIndex, table.labels);

            const entries = Object.entries(table.answers || {}).map(([fieldId, rawValue]) => {
              const meta = metaIndex[fieldId] || {};
              const formattedValue = formatAnswerValue(rawValue, meta, metaIndex);
              return {
                id: fieldId,
                label: meta.label || fieldId,
                description: meta.description || null,
                value: formattedValue,
                rawValue,
              };
            });

            results.push({
              id: table.id,
              title: table.title || schema.title || table.id,
              description: table.description || schema.description || null,
              order: table.order || schema.order,
              entries,
            });
          } catch (error) {
            console.error('[useEvaluationSummaryFormatter] table processing error:', table.id, error);
          }
        }

        if (!isCancelled) {
          setFormattedTables(results);
        }
      } catch (error) {
        console.error('[useEvaluationSummaryFormatter] error:', error);
        if (!isCancelled) {
          setFormattedTables([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    processTables();

    return () => {
      isCancelled = true;
    };
  }, [tables]);

  const sortedTables = useMemo(() => {
    return [...formattedTables].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title);
    });
  }, [formattedTables]);

  return {
    isLoading,
    tables: sortedTables,
  };
};

export default useEvaluationSummaryFormatter;
