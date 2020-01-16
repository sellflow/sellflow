import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Alert,
} from 'react-native';
import { Text, IconButton } from 'exoflex';
import { Menu } from 'react-native-paper';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { AddressItem } from '../types/types';
import formatAddress from '../helpers/formatAddress';

type Props = {
  data: AddressItem;
  style?: StyleProp<ViewStyle>;
};

export default function ManageAddress({ data, style }: Props) {
  let { id, name, default: primary, phone } = data;
  let [showMenu, setShowMenu] = useState(false);

  let onEdit = () => Alert.alert('Edit', 'Edit Address with ID ' + id); //TODO API WITH ID
  let onDelete = () => Alert.alert('Delete', 'Delete Address with ID ' + id);
  let onSetPrimary = () =>
    Alert.alert('Set Primary', 'Set Primary Address with ID ' + id);

  return (
    <TouchableOpacity style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>{name}</Text>
        <Menu
          style={[styles.menuBox, styles.padding]}
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              color={COLORS.primaryColor}
              onPress={() => {
                setShowMenu(true);
              }}
              style={styles.iconButton}
            />
          }
        >
          <TouchableOpacity onPress={onEdit}>
            <Text weight="medium" style={[styles.label, styles.padding]}>
              {t('Edit')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Text style={[styles.deleteLabel, styles.padding]} weight="medium">
              {t('Delete')}
            </Text>
          </TouchableOpacity>
        </Menu>
      </View>
      <Text style={[styles.address, styles.opacity]} numberOfLines={3}>
        {formatAddress(data)}
      </Text>
      <Text style={styles.opacity}>{phone}</Text>
      <View style={styles.indicatorContainer}>
        {primary ? (
          <View style={styles.primary}>
            <IconButton
              icon="check"
              color={COLORS.primaryColor}
              disabled={true}
              style={styles.iconButton}
            />
            <Text
              style={[styles.label, styles.blueText, styles.opacity]}
              weight="medium"
            >
              {t('Primary Address')}
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.setPrimary} onPress={onSetPrimary}>
            <Text style={[styles.label, styles.blueText]} weight="medium">
              {t('Set as Primary Address')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    paddingLeft: 12,
    paddingTop: 6,
  },
  primary: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  setPrimary: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    paddingVertical: 12,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuBox: {
    justifyContent: 'space-between',
  },
  label: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.black,
  },
  deleteLabel: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.red,
    width: 100,
  },
  padding: { paddingHorizontal: 16, paddingVertical: 8 },
  indicatorContainer: {
    marginTop: 12,
    paddingRight: 12,
  },
  address: {
    fontSize: FONT_SIZE.small,
    color: COLORS.black,
  },
  blueText: {
    color: COLORS.primaryColor,
  },
  opacity: {
    opacity: 0.6,
  },
  iconButton: { margin: 0 },
});
