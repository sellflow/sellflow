import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'exoflex';

import { defaultButton, defaultButtonLabel } from '../../../constants/theme';

type Props = {
  label: string;
  onPressAction: () => void;
};

export default function BottomButton(props: Props) {
  let { label, onPressAction } = props;
  return (
    <Button
      style={[defaultButton, styles.buttonStyle]}
      labelStyle={defaultButtonLabel}
      onPress={onPressAction}
    >
      {label}
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginBottom: 24,
  },
});
