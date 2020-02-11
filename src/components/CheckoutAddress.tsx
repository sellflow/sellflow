import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Alert,
} from 'react-native';
import { Text, RadioButton } from 'exoflex';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { AddressItem } from '../types/types';
import formatAddress from '../helpers/formatAddress';

type Props = {
  style?: StyleProp<ViewStyle>;
  isSelected: boolean;
  onSelect: () => void;
  data: AddressItem;
};

export default function CheckoutAddress({
  style,
  isSelected,
  onSelect,
  data,
}: Props) {
  let { id, name, phone } = data;

  let onEdit = () => Alert.alert('Edit Clicked', 'Edit Address with ID ' + id);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        styles.rowFlex,
        isSelected ? styles.selectedBorder : styles.greyBorder,
        style,
      ]}
      onPress={() => onSelect()}
    >
      <RadioButton
        size={18}
        style={styles.radioButton}
        checked={isSelected}
        onPress={() => onSelect()}
      />
      <View style={styles.textContainer}>
        <View style={styles.nameText}>
          <Text style={styles.label}>{name}</Text>
          <TouchableOpacity onPress={onEdit}>
            <Text style={[styles.label, styles.textCapitalized]}>
              {t('Edit')}
            </Text>
          </TouchableOpacity>
        </View>
        {formatAddress(data).map((item) =>
          item ? (
            <Text key={item} style={[styles.address, styles.opacity]}>
              {item}
            </Text>
          ) : (
            <Text>{t('No Addresses To Display')}</Text>
          ),
        )}
        <Text style={[styles.opacity, styles.phone]}>
          {t('Phone: {phone}', { phone })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  greyBorder: { borderColor: COLORS.lightGrey },
  selectedBorder: { borderColor: COLORS.primaryColor },
  textContainer: { flex: 1, paddingBottom: 12 },
  rowFlex: { flexDirection: 'row' },
  label: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.black,
  },
  textCapitalized: {
    textTransform: 'uppercase',
  },
  nameText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  address: {
    fontSize: FONT_SIZE.small,
    color: COLORS.black,
    marginTop: 6,
  },
  phone: {
    marginTop: 6,
  },
  opacity: {
    opacity: 0.6,
  },
  radioButton: { padding: 2, alignSelf: 'flex-start', marginTop: 12 },
});
