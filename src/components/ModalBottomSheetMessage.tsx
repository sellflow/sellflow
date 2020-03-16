import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button } from 'exoflex';
import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';

type Props = {
  isError: boolean;
  message: string;
  onPressModalButton?: () => void;
  buttonText?: string;
};

export default function ModalBottomSheetMessage(props: Props) {
  let { isError, message, onPressModalButton, buttonText } = props;
  return (
    <>
      <View style={styles.iconContainer}>
        {isError ? (
          <Image
            source={require('../../assets/images/errorImage.png')}
            style={styles.image}
          />
        ) : (
          <Image
            source={require('../../assets/images/successImage.png')}
            style={styles.image}
          />
        )}
      </View>
      <Text style={styles.message}>{t(' {message}', { message })}</Text>
      {onPressModalButton ? (
        <Button style={styles.buttonStyle} onPress={onPressModalButton}>
          <Text weight="medium" style={styles.buttonText}>
            {buttonText ? t('{buttonText}', { buttonText }) : t('Close')}
          </Text>
        </Button>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 84,
    height: 84,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  textInputContainer: {
    flex: 1,
    marginHorizontal: 24,
  },
  textInput: {
    marginTop: 8,
  },
  message: {
    textAlign: 'center',
  },
  buttonStyle: {
    marginVertical: 24,
    marginHorizontal: 24,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
  },
});
