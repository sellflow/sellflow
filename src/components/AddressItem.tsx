import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Text, RadioButton, IconButton } from 'exoflex';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';

type Props = {
  style: StyleProp<ViewStyle>;
  name: string;
  address: string;
  primary?: boolean;
  type: 'checkout' | 'manage';
  phoneNumber: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onCardPress?: () => void;
  isSelected: boolean;
  onSelect: () => void;
};

type MenuProps = {
  deleteClick?: () => void;
  editClick?: () => void;
  onCancel?: () => void;
  showMenu?: boolean;
};

export default function AddressItem(props: Props) {
  let {
    style,
    name,
    address,
    primary,
    type,
    phoneNumber,
    onEdit,
    onDelete,
    onCardPress,
    isSelected,
    onSelect,
  } = props;
  let [showMenu, setShowMenu] = useState(false);

  if (type === 'checkout') {
    return (
      <TouchableOpacity
        style={[styles.container, styles.rowFlex, style]}
        onPress={() => onSelect()}
      >
        <RadioButton
          size={18}
          style={styles.radioButton}
          checked={isSelected}
        />
        <View style={{ flex: 1, paddingBottom: 12 }}>
          <View style={styles.nameText}>
            <Text style={styles.label}>{name}</Text>
            <TouchableOpacity onPress={onEdit}>
              <Text style={[styles.label, styles.textCapitalized]}>
                {t('Edit')}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.address, styles.opacity]} numberOfLines={3}>
            {address}
          </Text>
          <Text style={styles.opacity}>{phoneNumber}</Text>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={[styles.container, style]} onPress={onCardPress}>
        <Text style={[styles.label, styles.nameText]}>{name}</Text>
        <IconButton
          icon="dots-vertical"
          color={COLORS.primaryColor}
          style={styles.iconButton}
          onPress={() => {
            setShowMenu(true);
          }}
        />
        <Text style={[styles.address, styles.opacity]} numberOfLines={3}>
          {address}
        </Text>
        <Text style={styles.opacity}>{phoneNumber}</Text>
        <View style={styles.indicatorContainer}>
          {primary ? (
            <>
              <IconButton
                icon="check"
                color={COLORS.primaryColor}
                disabled={true}
              />
              <Text
                style={[styles.label, styles.blueText, styles.opacity]}
                weight="medium"
              >
                {t('Primary Address')}
              </Text>
            </>
          ) : (
            <TouchableOpacity>
              <Text style={[styles.label, styles.blueText]} weight="medium">
                {t('Set as Primary Address')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <MiniMenu
          editClick={() => {
            setShowMenu(false);
            onEdit && onEdit();
          }}
          deleteClick={() => {
            setShowMenu(false);
            onDelete && onDelete();
          }}
          onCancel={() => setShowMenu(false)}
          showMenu={showMenu}
        />
      </TouchableOpacity>
    );
  }
}

function MiniMenu(props: MenuProps) {
  let { editClick, deleteClick, showMenu, onCancel } = props;
  return showMenu ? (
    <TouchableOpacity style={styles.menuArea} onPress={onCancel}>
      <View style={styles.menuBox} pointerEvents="box-none">
        <TouchableOpacity onPress={editClick}>
          <Text style={styles.label} weight="medium">
            {t('Edit')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteClick}>
          <Text style={styles.deleteLabel} weight="medium">
            {t('Delete')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  menuArea: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    right: 0,
  },
  menuBox: {
    height: '70%',
    top: 12,
    right: 12,
    justifyContent: 'space-between',
    position: 'absolute',
    width: 100,
    padding: 14,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  rowFlex: { flexDirection: 'row' },
  label: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.black,
  },
  textCapitalized: {
    textTransform: 'capitalize',
  },
  nameText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  deleteLabel: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.red,
  },
  indicatorContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    alignItems: 'center',
    marginTop: 12,
  },
  address: {
    fontSize: FONT_SIZE.small,
    color: COLORS.black,
    marginVertical: 6,
  },
  blueText: {
    color: COLORS.primaryColor,
    marginLeft: 8,
    marginVertical: 12,
  },
  opacity: {
    opacity: 0.6,
  },
  iconButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  radioButton: { padding: 2, alignSelf: 'flex-start', marginTop: 12 },
});
