import React, { forwardRef, Ref, useCallback, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput as NativeTextInput,
  TextInputFocusEventData,
  TextInputProps as NativeTextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

import Text from './Text';

type Props = NativeTextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  errorMessage?: string;
  errorMessageStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  mode?: 'flat' | 'outlined';
  ref?: Ref<NativeTextInput>;
  showErrorIcon?: boolean;
};

function TextInput(props: Props, ref: Ref<NativeTextInput>) {
  let {
    autoCorrect = false,
    containerStyle,
    disabled = false,
    editable = true,
    errorMessage,
    errorMessageStyle,
    label,
    labelStyle,
    mode = 'outlined',
    multiline,
    onBlur,
    onChangeText,
    onFocus,
    showErrorIcon = true,
    style,
    keyboardType = 'default',
    ...otherProps
  } = props;

  let { colors, roundness, isRTL } = useTheme();

  let [isFocused, setIsFocused] = useState(false);

  let handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (disabled || !editable) {
        return;
      }

      onFocus && onFocus(e);
      setIsFocused(true);
    },
    [onFocus, disabled, editable],
  );

  let handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (disabled || !editable) {
        return;
      }

      onBlur && onBlur(e);
      setIsFocused(false);
    },
    [onBlur, disabled, editable],
  );

  let handleChangeText = useCallback(
    (text: string) => {
      if (disabled || !editable) {
        return;
      }
      if (
        (keyboardType === 'number-pad' || keyboardType === 'numeric') &&
        !text.match(/^-?[0-9]*$/)
      ) {
        return;
      }

      onChangeText && onChangeText(text);
    },
    [onChangeText, disabled, editable, keyboardType],
  );

  let isError = !!errorMessage;
  let hasLabel = !!label;

  let getColor = (target: 'border' | 'label') => {
    if (target === 'label') {
      return colors.placeholder;
    }
    if (disabled) {
      return colors.disabled;
    }
    if (isError) {
      return colors.error;
    }
    if (isFocused) {
      return colors.accent;
    }
    if (target === 'border') {
      return colors.border;
    }
  };

  let multilineStyle = {
    minHeight: mode === 'outlined' || hasLabel ? 60 : 0,
    height: 'auto',
  } as StyleProp<ViewStyle>;

  let wrapperStyle: StyleProp<ViewStyle> =
    mode === 'outlined'
      ? [
          styles.outlinedContainer,
          {
            borderRadius: roundness,
            backgroundColor: disabled ? colors.disabled : colors.surface,
            justifyContent: hasLabel ? 'space-between' : 'center',
          },
        ]
      : [
          styles.flatContainer,
          {
            justifyContent: hasLabel ? 'space-between' : 'flex-end',
          },
          hasLabel && { height: 60 },
        ];

  return (
    <>
      <View
        style={[
          { borderColor: getColor('border') },
          multiline && multilineStyle,
          containerStyle,
          ...wrapperStyle,
        ]}
      >
        {hasLabel && (
          <Text style={[styles.label, { color: getColor('label') }]}>
            {label}
          </Text>
        )}
        <NativeTextInput
          ref={ref}
          autoCorrect={autoCorrect}
          autoCapitalize="sentences"
          editable={!disabled && editable}
          underlineColorAndroid="transparent"
          placeholderTextColor={colors.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          style={[
            { color: disabled ? colors.placeholder : colors.text },
            style,
          ]}
          textAlign={isRTL ? 'right' : 'left'}
          {...otherProps}
        />
        {isError && showErrorIcon && (
          <View style={styles.errorIconContainer}>
            <IconButton icon="alert-circle-outline" color={colors.error} />
          </View>
        )}
      </View>
      {isError && (
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            styles.errorMessage,
            mode === 'flat' && { paddingHorizontal: 0 },
            errorMessageStyle,
          ]}
        >
          {errorMessage}
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  errorIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
  },
  errorMessage: {
    padding: 12,
    paddingTop: 0,
    marginTop: -5,
    color: '#dd0000',
  },
  flatContainer: {
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 12,
  },
  outlinedContainer: {
    borderWidth: 1,
    padding: 12,
    paddingVertical: 10,
  },
});

export default forwardRef(TextInput);
