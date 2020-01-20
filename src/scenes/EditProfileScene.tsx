import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { Text, Button, Avatar, TextInput } from 'exoflex';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import { DatePicker } from '../core-ui';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { validateEmail, validatePassword } from '../helpers/validation';
import formatDateLong from '../helpers/formatDateLong';
import { profile } from '../../assets/images';

export default function EditProfileScene() {
  let [profilePicture, setProfilePicture] = useState(profile);
  let [isPickerVisible, setIsPickerVisible] = useState(false);
  let [birthDate, setBirthDate] = useState('');
  let [name, setName] = useState('');
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let dimensions = useDimensions();

  let isEmailValid = validateEmail(email);
  let isPasswordValid = validatePassword(password);

  let togglePickerVisible = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  let openGallery = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      Alert.alert(t('Camera Roll permission not granted.'));
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setProfilePicture({ uri: result.uri });
      }
    }
  };

  let containerStyle = () => {
    if (dimensions.screenSize === ScreenSize.Small) {
      return styles.container;
    } else {
      return [styles.container, { marginHorizontal: 36 }];
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <DatePicker
          isVisible={isPickerVisible}
          onCancel={() => setIsPickerVisible(false)}
          onConfirm={(date: string) => {
            setBirthDate(date);
            setIsPickerVisible(false);
          }}
        />
        <View style={containerStyle()}>
          <KeyboardAvoidingView behavior="position">
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.profilePictureEditContainer}
                onPress={openGallery}
              >
                <Avatar.Image source={profilePicture} size={92} />
                <Text style={styles.changePictureClickable}>
                  {t('Change Profile Picture')}
                </Text>
              </TouchableOpacity>

              <View style={styles.formsContainer}>
                <View style={styles.infividualFormContainer}>
                  <Text style={styles.greyText}>{t('Name')}</Text>
                  <TextInput
                    autoFocus={true}
                    clearTextOnFocus={false}
                    autoCapitalize="none"
                    textContentType="name"
                    mode="flat"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
                <View style={styles.infividualFormContainer}>
                  <Text style={styles.greyText}>{t('Email Address')}</Text>
                  <TextInput
                    clearTextOnFocus={false}
                    autoCapitalize="none"
                    errorMessage={
                      (isEmailValid && email !== '') || email === ''
                        ? undefined
                        : 'Email is not valid'
                    }
                    textContentType="emailAddress"
                    mode="flat"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                <View style={styles.infividualFormContainer}>
                  <Text style={styles.greyText}>{t('Password')}</Text>
                  <TextInput
                    textContentType="password"
                    autoCapitalize="none"
                    errorMessage={
                      (isPasswordValid && password !== '') || password === ''
                        ? undefined
                        : 'Password must contain number, uppercase and lowercase letter'
                    }
                    secureTextEntry={true}
                    mode="flat"
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
                <View style={styles.infividualFormContainer}>
                  <Text style={styles.greyText}>{t('Date of Birth')}</Text>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={togglePickerVisible}
                  >
                    <TextInput
                      mode="flat"
                      value={formatDateLong(birthDate)}
                      disabled={true}
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <View style={styles.buttonSaveContainer}>
            <Button>
              <Text weight="500" style={styles.saveText}>
                {t('Save Changes')}
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: COLORS.white,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  container: {
    marginHorizontal: 24,
    justifyContent: 'space-between',
    flexGrow: 2,
  },
  greyText: {
    color: COLORS.grey,
  },
  profilePictureEditContainer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  changePictureClickable: {
    paddingTop: 16,
    fontSize: FONT_SIZE.medium,
    color: COLORS.primaryColor,
  },
  formsContainer: {
    marginVertical: 12,
    alignSelf: 'flex-start',
    width: '100%',
  },
  infividualFormContainer: {
    marginVertical: 12,
  },
  buttonSaveContainer: {
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: COLORS.red,
  },
  saveText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
  },
});
