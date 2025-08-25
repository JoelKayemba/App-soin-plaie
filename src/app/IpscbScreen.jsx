// src/app/IPSCBScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../hooks/useThemeMode';
import useResponsive from '../hooks/useResponsive';
import { useIPSCBCalculator } from '../features/calculators/ipscb';
import BackButton from '../components/common/BackButton';

const IPSCBScreen = ({ navigation }) => {
  const { makeStyles, colors, elevation, isDark } = useThemeMode();
  const { spacing, typeScale, isTablet } = useResponsive();
  
  const {
    pressures,
    pasBrasMax,
    indicesIPSCB,
    interpretations,
    updatePressure,
    resetPressures,
    isComplete
  } = useIPSCBCalculator();

  const [showResults, setShowResults] = useState(false);
  const scrollViewRef = React.useRef();

  const useStyles = makeStyles((c) => ({
    root: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
      paddingBottom: spacing.md,
      backgroundColor: c.background,
      
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 24 * typeScale,
      fontWeight: '700',
      color: c.text,
      marginLeft: spacing.md,
      
    },
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.textLight,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      borderWidth:1,
      borderColor:c.primary,
      ...elevation(1),
    },
    resetButtonText: {
      fontSize: 14 * typeScale,
      color: c.primary,
      fontWeight: '600',
      marginLeft: spacing.xs,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    instruction: {
      fontSize: 16 * typeScale,
      color: c.black,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    anatomyImage: {
      width: 300,
      height: 480,
    },
    inputFieldsContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    inputField: {
      position: 'absolute',
      backgroundColor: c.background,
      borderWidth: 1,
      borderColor: c.primaryDark,
      borderRadius: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      minWidth: isTablet ? 120 : 80,
      width: isTablet ? 160 : 120,
      textAlign: 'center',
      color: c.text,
      fontSize: isTablet ? 18 * typeScale : 16 * typeScale,
    },
    inputLabel: {
      position: 'absolute',
      fontSize: isTablet ? 16 * typeScale : 14 * typeScale,
      color: c.black,
      fontWeight: '600',
      textAlign: 'center',
      minWidth: isTablet ? 160 : 120,
      backgroundColor: c.background,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xs,
      borderRadius: spacing.xs,
    },
    // Positions des champs d'input selon l'image anatomique
    brachialeDroite: {
      position: 'absolute',
      top: 125, // 2/4 de l'image
      left: 10,
    },
    brachialeGauche: {
      position: 'absolute',
      top: 125, // 2/4 de l'image
      right: 10,
    },
    tibialePosterieureDroite: {
      position: 'absolute',
      top: 350, // 3.5/4 de l'image
      left: 10,
    },
    pedieuseDroite: {
      position: 'absolute',
      top: 430, // 3.5/4 de l'image
      left: '15%',
    },
    tibialePosterieureGauche: {
      position: 'absolute',
      top: 350, // 3.5/4 de l'image
      right: 10,
    },
    pedieuseGauche: {
      position: 'absolute',
      top: 430, // 3.5/4 de l'image
      right: '15%',
    },
    // Labels des champs
    labelBrachialeDroite: {
      position: 'absolute',
      top: 100, // Juste au-dessus des champs brachiales
      left: 10,
    },
    labelBrachialeGauche: {
      position: 'absolute',
      top: 100, // Juste au-dessus des champs brachiales
      right: 10,
    },
    labelTibialePosterieureDroite: {
      position: 'absolute',
      top: 290, // Juste au-dessus des champs tibiales
      left: 10,
      width:120
    },
    labelPedieuseDroite: {
      position: 'absolute',
      top: 400, // Juste au-dessus des champs pédieuses
      left: 10,
    },
    labelTibialePosterieureGauche: {
      position: 'absolute',
      top: 280, // Juste au-dessus des champs tibiales
      right: 10,
      width:120,
      
    },
    labelPedieuseGauche: {
      position: 'absolute',
      top: 400, // Juste au-dessus des champs pédieuses
      right: 10,
    },
    resultsSection: {
      backgroundColor: c.background,
      borderRadius: spacing.md,
      padding: spacing.lg,
      marginTop: spacing.lg,
      borderWidth:1,
      borderColor:c.border,
      ...elevation(1),
    },
    resultsTitle: {
      fontSize: 20 * typeScale,
      fontWeight: 'bold',
      color: c.primary,
      marginBottom: spacing.md,
      textAlign: 'center',
      borderBottomWidth:1,
      borderBottomColor:c.border
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    resultSide: {
      flex: 1,
      fontSize: 14 * typeScale,
      color: c.text,
      fontWeight: '500',
    },
    resultValue: {
      flex: 1,
      fontSize: 14 * typeScale,
      color: c.text,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    resultInterpretation: {
      flex: 1,
      alignItems: 'center',
    },
    interpretationBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    interpretationText: {
      fontSize: 12 * typeScale,
      color: c.text,
      fontWeight: '600',
      marginLeft: spacing.xs,
    },
    pasBrasMax: {
      backgroundColor: c.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: spacing.md,
      marginBottom: spacing.md,
    },
    pasBrasMaxText: {
      color: c.textLight,
      fontSize: 16 * typeScale,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    noDataText: {
      fontSize: 12 * typeScale,
      color: c.secondary,
      fontStyle: 'italic',
    },
    interpretationTable: {
      backgroundColor: c.background,
      borderRadius: spacing.md,
      padding: spacing.lg,
      marginTop: spacing.lg,
      borderWidth: 1,
      borderColor: c.border,
      ...elevation(1),
    },
    interpretationTableTitle: {
      fontSize: 18 * typeScale,
      fontWeight: 'bold',
      color: c.primary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    interpretationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    interpretationRange: {
      flex: 1,
      fontSize: 14 * typeScale,
      color: c.text,
      fontWeight: '600',
    },
    interpretationDescription: {
      flex: 2,
      fontSize: 14 * typeScale,
      color: c.text,
    },
    interpretationBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: spacing.xs,
      marginLeft: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    interpretationBadgeText: {
      fontSize: 12 * typeScale,
      fontWeight: '600',
      marginLeft: spacing.xs,
    },
    copyright: {
      fontSize: 12 * typeScale,
      color: c.secondary,
      textAlign: 'center',
      marginTop: spacing.lg,
      lineHeight: 16,
    },
  }));

  const handleReset = () => {
    Alert.alert(
      'Réinitialiser',
      'Voulez-vous réinitialiser toutes les pressions ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réinitialiser', onPress: resetPressures }
      ]
    );
  };

  const renderInputField = (field, label, position, labelPosition) => (
    <View key={field}>
      <Text style={[s.inputLabel, s[labelPosition]]}>
        {label}
      </Text>
      <TextInput
        style={[s.inputField, s[position]]}
        value={pressures[field]}
        onChangeText={(value) => updatePressure(field, value)}
        placeholder="0"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        maxLength={3}
        onFocus={() => {
          // Faire défiler vers le champ actif
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({
              y: position === 'pedieuseDroite' || position === 'pedieuseGauche' ? 300 : 200,
              animated: true
            });
          }, 100);
        }}
      />
    </View>
  );

  const s = useStyles();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={s.root}>
          {/* Header */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <BackButton navigation={navigation} />
              <Text style={s.title}>Calcul IPSCB</Text>
            </View>
            <TouchableOpacity style={s.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={20} color={colors.primary} />
              <Text style={s.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            ref={scrollViewRef}
            style={s.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          <Text style={s.instruction}>
            Saisissez les pressions artérielles systoliques
          </Text>

          {/* Image anatomique avec champs d'input */}
          <View style={s.imageContainer}>
            <Image
              source={isDark ? require('../assets/anatomie_light.png') : require('../assets/anatomie.png')}
              style={s.anatomyImage}
              resizeMode="contain"
            />
            
            <View style={s.inputFieldsContainer}>
              {renderInputField('brachialeDroite', 'Brachiale droite', 'brachialeDroite', 'labelBrachialeDroite')}
              {renderInputField('brachialeGauche', 'Brachiale gauche', 'brachialeGauche', 'labelBrachialeGauche')}
              {renderInputField('tibialePosterieureDroite', 'Tibiale postérieure droite', 'tibialePosterieureDroite', 'labelTibialePosterieureDroite')}
              {renderInputField('pedieuseDroite', 'Pédieuse droite', 'pedieuseDroite', 'labelPedieuseDroite')}
              {renderInputField('tibialePosterieureGauche', 'Tibiale postérieure gauche', 'tibialePosterieureGauche', 'labelTibialePosterieureGauche')}
              {renderInputField('pedieuseGauche', 'Pédieuse gauche', 'pedieuseGauche', 'labelPedieuseGauche')}
            </View>
          </View>



                    {/* Résultats et interprétation */}
          <View style={s.resultsSection}>
            <Text style={s.resultsTitle}>Résultats et interprétation</Text>
            
            {Object.entries(indicesIPSCB).map(([key, value]) => {
              const labels = {
                tibialePosterieureDroite: 'Tibiale postérieure droite',
                pedieuseDroite: 'Pédieuse droite',
                tibialePosterieureGauche: 'Tibiale postérieure gauche',
                pedieuseGauche: 'Pédieuse gauche'
              };

              return (
                <View key={key} style={s.resultRow}>
                  <Text style={s.resultSide}>{labels[key]}</Text>
                  <Text style={s.resultValue}>{value || '0.00'}</Text>
                  <View style={s.resultInterpretation}>
                    {value ? (
                      <View style={[s.interpretationBadge, { backgroundColor: interpretations[key]?.color + '20' }]}>
                        {parseFloat(value) < 0.4 ? (
                          <Ionicons name="flag" size={16} color="#D32F2F" />
                        ) : (
                          <Ionicons name="information-circle" size={16} color={interpretations[key]?.color} />
                        )}
                        <Text style={[s.interpretationText, { color: interpretations[key]?.color }]}>
                          {interpretations[key]?.niveau || 'Non calculé'}
                        </Text>
                      </View>
                    ) : (
                      <Text style={s.noDataText}>Non calculé</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Table d'interprétation */}
          <View style={s.interpretationTable}>
            <Text style={s.interpretationTableTitle}>Table d'interprétation</Text>
            
            <View style={s.interpretationRow}>
              <Text style={s.interpretationRange}>{'>'} 1,40</Text>
              <Text style={s.interpretationDescription}>Indéterminé (artères non compressibles)</Text>
              <View style={[s.interpretationBadge, { backgroundColor: '#9E9E9E20' }]}>
                <Ionicons name="help-circle" size={16} color="#9E9E9E" />
                <Text style={[s.interpretationBadgeText, { color: '#9E9E9E' }]}>Indéterminé</Text>
              </View>
            </View>
            
            <View style={s.interpretationRow}>
              <Text style={s.interpretationRange}>1,0 à 1,4</Text>
              <Text style={s.interpretationDescription}>Normal</Text>
              <View style={[s.interpretationBadge, { backgroundColor: '#4CAF5020' }]}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={[s.interpretationBadgeText, { color: '#4CAF50' }]}>Normal</Text>
              </View>
            </View>
            
            <View style={s.interpretationRow}>
              <Text style={s.interpretationRange}>0,9 à 0,99</Text>
              <Text style={s.interpretationDescription}>Limite</Text>
              <View style={[s.interpretationBadge, { backgroundColor: '#FF980020' }]}>
                <Ionicons name="warning" size={16} color="#FF9800" />
                <Text style={[s.interpretationBadgeText, { color: '#FF9800' }]}>Limite</Text>
              </View>
            </View>
            
            <View style={s.interpretationRow}>
              <Text style={s.interpretationRange}>0,7 à 0,89</Text>
              <Text style={s.interpretationDescription}>Anormal, atteinte légère</Text>
              <View style={[s.interpretationBadge, { backgroundColor: '#FFC10720' }]}>
                <Ionicons name="alert-circle" size={16} color="#FFC107" />
                <Text style={[s.interpretationBadgeText, { color: '#FFC107' }]}>Légère</Text>
              </View>
            </View>
            
            <View style={s.interpretationRow}>
              <Text style={s.interpretationRange}>0,4 à 0,69</Text>
              <Text style={s.interpretationDescription}>Anormal, atteinte modérée</Text>
              <View style={[s.interpretationBadge, { backgroundColor: '#FF572220' }]}>
                <Ionicons name="alert" size={16} color="#FF5722" />
                <Text style={[s.interpretationBadgeText, { color: '#FF5722' }]}>Modérée</Text>
              </View>
            </View>
            
            <View style={s.interpretationRow}>
              <Text style={s.interpretationRange}>&lt; 0,4</Text>
              <Text style={s.interpretationDescription}>Anormal, atteinte sévère</Text>
              <View style={[s.interpretationBadge, { backgroundColor: '#D32F2F20' }]}>
                <Ionicons name="flag" size={16} color="#D32F2F" />
                <Text style={[s.interpretationBadgeText, { color: '#D32F2F' }]}>Sévère</Text>
              </View>
            </View>
          </View>

          {/* Copyright */}
          <Text style={s.copyright}>
            ©2023 Health Sense Ai. All rights reserved.{'\n'}
            All copyrights and trademarks are the property of Health Sense Ai or their respective owners or assigns.{'\n'}
            Septembre 2024. Utilisation autorisée sous licence.
          </Text>
                  </ScrollView>
    </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

  );
};

export default IPSCBScreen;