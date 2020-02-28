import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Modal, Portal, Text } from 'exoflex';

import { COLORS } from '../constants/colors';
import { FONT_SIZE, FONT_FAMILY } from '../constants/fonts';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { useKeyboardListener } from '../helpers/keyboardListener';

type Props = {
  isModalVisible: boolean;
  toggleModal: () => void;
  children: React.ReactNode;
  width?: number;
  height?: number;
} & HeaderProps;

type HeaderProps = {
  title: string;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
};

function ModalHeader(props: HeaderProps) {
  let { title, headerLeft, headerRight } = props;
  return (
    <View style={styles.modalHeader}>
      <View style={styles.headerLeft}>{headerLeft}</View>
      <Text style={styles.modalTitle}>{title}</Text>
      <View style={styles.headerRight}>{headerRight}</View>
    </View>
  );
}

export default function ModalBottomSheet(props: Props) {
  let dimensions = useDimensions();

  let {
    isModalVisible,
    toggleModal,
    title,
    headerLeft,
    headerRight,
    width = 400,
    height = 320,
    children,
  } = props;

  let { keyboardHeight } = useKeyboardListener();

  let modalStyle = () => {
    if (dimensions.screenSize === ScreenSize.Small) {
      return styles.modalPhone;
    } else {
      return [styles.modalTablet, { width, height }];
    }
  };

  let animatedViewStyle = () => {
    if (dimensions.screenSize === ScreenSize.Small) {
      return [
        {
          paddingBottom: keyboardHeight,
        },
      ];
    } else {
      return [styles.modalTablet, { width, height }];
    }
  };

  return (
    <Portal>
      <Modal
        visible={isModalVisible}
        onDismiss={toggleModal}
        contentContainerStyle={modalStyle()}
      >
        <Animated.View style={[styles.defaultModal, animatedViewStyle()]}>
          <ModalHeader
            title={title}
            headerLeft={headerLeft}
            headerRight={headerRight}
          />
          {children}
        </Animated.View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  defaultModal: {
    backgroundColor: COLORS.white,
  },
  modalPhone: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalTablet: {
    borderRadius: 8,
    alignSelf: 'center',
  },
  modalHeader: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: FONT_SIZE.large,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
