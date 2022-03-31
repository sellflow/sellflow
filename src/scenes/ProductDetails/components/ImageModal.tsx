import React from 'react';
import { Modal, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IconButton, useTheme } from 'react-native-paper';

import { COLORS } from '../../../constants/colors';

type Props = {
  activeIndex: number;
  images: Array<string>;
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
};

export default function ImageModal(props: Props) {
  let { activeIndex, images, isVisible, setVisible } = props;
  let { isRTL } = useTheme();
  let imagesUrls = images.map((url) => ({ url }));

  let renderHeader = () => (
    <IconButton
      icon={isRTL ? 'chevron-right' : 'chevron-left'}
      color={COLORS.white}
      size={35}
      onPress={() => setVisible(false)}
      style={styles.headerIcon}
    />
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onDismiss={() => setVisible(false)}
    >
      <ImageViewer
        index={activeIndex}
        imageUrls={imagesUrls}
        enableSwipeDown
        onSwipeDown={() => setVisible(false)}
        renderHeader={renderHeader}
        useNativeDriver={true}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    position: 'absolute',
    left: 0,
    top: 17,
    zIndex: 14,
  },
});
