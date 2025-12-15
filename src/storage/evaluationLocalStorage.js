import * as SecureStore from 'expo-secure-store';

const STORAGE_NAMESPACE = 'app_soin_plaie_evaluations';
const META_SUFFIX = '_meta';
const TABLE_PREFIX = '_table_';

const buildMetaKey = (evaluationId) => `${STORAGE_NAMESPACE}_${evaluationId}${META_SUFFIX}`;
const buildTableKey = (evaluationId, tableId) => `${STORAGE_NAMESPACE}_${evaluationId}${TABLE_PREFIX}${tableId}`;

const serialize = (data) => JSON.stringify(data);
const deserialize = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('[evaluationLocalStorage] JSON parse error:', error);
    return null;
  }
};

const getDefaultMeta = () => ({
  version: 1,
  updatedAt: null,
  lastVisitedTableId: null,
  savedTables: {},
});

export const loadEvaluationProgress = async (evaluationId) => {
  try {
    const metaValue = await SecureStore.getItemAsync(buildMetaKey(evaluationId));
    const parsedMeta = deserialize(metaValue);
    return {
      ...getDefaultMeta(),
      ...(parsedMeta || {}),
    };
  } catch (error) {
    console.error('[evaluationLocalStorage] load error:', error);
    return getDefaultMeta();
  }
};

export const loadTableAnswers = async (evaluationId, tableId) => {
  try {
    const value = await SecureStore.getItemAsync(buildTableKey(evaluationId, tableId));
    return deserialize(value) || {};
  } catch (error) {
    console.error('[evaluationLocalStorage] load table error:', error);
    return {};
  }
};

export const saveTableProgress = async (evaluationId, tableId, payload = {}, options = {}) => {
  try {
    const metaKey = buildMetaKey(evaluationId);
    const answersKey = buildTableKey(evaluationId, tableId);

    const { answers = {}, ...metaPayload } = payload;

    await SecureStore.setItemAsync(answersKey, serialize(answers));

    const existingMeta = await loadEvaluationProgress(evaluationId);
    const nextMeta = {
      ...existingMeta,
      updatedAt: new Date().toISOString(),
      lastVisitedTableId: options.lastVisitedTableId || existingMeta.lastVisitedTableId || tableId,
      savedTables: {
        ...existingMeta.savedTables,
        [tableId]: {
          ...metaPayload,
          updatedAt: new Date().toISOString(),
        },
      },
    };

    await SecureStore.setItemAsync(metaKey, serialize(nextMeta));
    return nextMeta;
  } catch (error) {
    console.error('[evaluationLocalStorage] save error:', error);
    return null;
  }
};

export const clearEvaluationProgress = async (evaluationId) => {
  try {
    const meta = await loadEvaluationProgress(evaluationId);
    const savedTables = Object.keys(meta.savedTables || {});

    await Promise.all(savedTables.map((tableId) => SecureStore.deleteItemAsync(buildTableKey(evaluationId, tableId))));
    await SecureStore.deleteItemAsync(buildMetaKey(evaluationId));
    return true;
  } catch (error) {
    console.error('[evaluationLocalStorage] clear error:', error);
    return false;
  }
};

export const updateLastVisitedTable = async (evaluationId, tableId) => {
  try {
    const metaKey = buildMetaKey(evaluationId);
    const current = await loadEvaluationProgress(evaluationId);
    const nextMeta = {
      ...current,
      lastVisitedTableId: tableId,
      updatedAt: new Date().toISOString(),
    };
    await SecureStore.setItemAsync(metaKey, serialize(nextMeta));
    return nextMeta;
  } catch (error) {
    console.error('[evaluationLocalStorage] update last visited error:', error);
    return null;
  }
};
