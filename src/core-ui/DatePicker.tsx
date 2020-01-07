import React from 'react';
import { DateTimePicker } from 'exoflex';

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
      is24Hour={true}
      maximumDate={new Date()}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
