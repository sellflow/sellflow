import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import { Button, IconButton, Text, Slider, TextInput } from 'exoflex';

import { ModalBottomSheet } from '../../../core-ui';
import { COLORS } from '../../../constants/colors';
import { FONT_FAMILY, FONT_SIZE } from '../../../constants/fonts';

export default function modalBottomSheetStory() {
  const ModalBottomSheetStory = () => {
    let [isModalVisible, setModalVisible] = useState(false);

    return (
      <View>
        <Button preset="invisible" onPress={() => setModalVisible(true)}>
          Open Modal
        </Button>
        <ModalBottomSheet
          isModalVisible={isModalVisible}
          toggleModal={() => setModalVisible(!isModalVisible)}
          title="Filter"
          headerLeft={
            <IconButton
              icon="chevron-left"
              color={COLORS.primaryColor}
              style={styles.headerButton}
              onPress={() => setModalVisible(!isModalVisible)}
            />
          }
          headerRight={<Text style={styles.clearButton}>Clear</Text>}
          height={284}
        >
          <View style={styles.content}>
            <View style={styles.sliderContainer}>
              <Slider
                sliderLength={322}
                values={[0, 10000000]}
                showLabel={false}
                min={0}
                max={10000000}
                step={10000}
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                mode="outlined"
                label={t('Min. Price')}
                containerStyle={styles.textInput}
              />
              <TextInput
                mode="outlined"
                label={t('Max. Price')}
                containerStyle={styles.textInput}
              />
            </View>
            <Button>Set Filter</Button>
          </View>
        </ModalBottomSheet>
      </View>
    );
  };

  return storiesOf('Modal Bottom Sheet', module).add(
    'Modal Bottom Sheet',
    () => (
      <View style={styles.container}>
        <ModalBottomSheetStory />
      </View>
    ),
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButton: {
    margin: 0,
    height: 24,
    width: 24,
  },
  clearButton: {
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.primaryColor,
    fontSize: FONT_SIZE.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 26,
  },
  sliderContainer: {
    alignItems: 'center',
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  textInput: {
    width: 148,
    height: 60,
  },
});
