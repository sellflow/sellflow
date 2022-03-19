import React from 'react';
import { StyleSheet } from 'react-native';

import { defaultButton, defaultButtonLabel } from '../../../constants/theme';
import { Button } from '../../../core-ui';

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
