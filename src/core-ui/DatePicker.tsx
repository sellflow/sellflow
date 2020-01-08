import React from 'react';
import { DateTimePicker } from 'exoflex';

import { is24Hour } from '../helpers/locale';

type Props = {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: (date: string) => void;
};

export default function DatePicker(props: Props) {
  let { isVisible, onCancel, onConfirm } = props;
  return (
    <DateTimePicker
      isVisible={isVisible}
      mode="date"
      is24Hour={is24Hour()}
      maximumDate={new Date()}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
