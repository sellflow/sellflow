import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import image from '../.././assets/images/lock.png';
import { Button } from 'exoflex';
import { defaultButton } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavProp } from '../types/Navigation';

export default function LockScene() {
  let { navigate } = useNavigation<StackNavProp<'LockScene'>>();

  return (
    <SafeAreaView style={styles.scene}>
      <Image source={image} width={100} height={100} style={styles.image} />

      <Text style={styles.loginNotification}>
        {t('Hey there! To continue please log in or create an account.')}
      </Text>

      <Button
        style={defaultButton}
        onPress={() => {
          navigate('Register');
        }}
      >
        {t('REGISTER')}
      </Button>
      <View style={styles.flexRow}>
        <Text style={styles.accountAlreadyText}>
          {t('Already have an account?')}
        </Text>
        <TouchableOpacity style={styles.top} onPress={() => navigate('Login')}>
          <Text style={styles.loginColor}>{t('Log In')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scene: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    maxWidth: 280,
    maxHeight: 280,
  },
  loginNotification: {
    fontSize: 18,
    textAlign: 'center',
    paddingBottom: 100,
  },
  flexRow: {
    flexDirection: 'row',
  },
  accountAlreadyText: {
    top: 100,
    paddingRight: 10,
  },
  top: {
    top: 100,
  },
  loginColor: {
    color: '#004fb4',
  },
});
