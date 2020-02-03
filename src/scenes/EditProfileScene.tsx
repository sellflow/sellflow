import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput as TextInputType,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import { Text, Button, Avatar, TextInput } from 'exoflex';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { useNavigation } from '@react-navigation/native';

import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import {
  INVALID_EMAIL_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  validateEmail,
  validatePassword,
} from '../helpers/validation';
import { profile } from '../../assets/images';
import { defaultButtonLabel, defaultButton } from '../constants/theme';
import { GET_AUTHENTICATED_USER } from '../graphql/client/clientQueries';
import { GetAuthenticatedUser } from '../generated/client/GetAuthenticatedUser';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { UPDATE_CUSTOMER_DATA } from '../graphql/server/auth';
import {
  UpdateCustomerData,
  UpdateCustomerDataVariables,
} from '../generated/server/UpdateCustomerData';
import { StackNavProp } from '../types/Navigation';

export default function EditProfileScene() {
  let [profilePicture, setProfilePicture] = useState(profile);
  let [isPickerVisible, setIsPickerVisible] = useState(false);
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [isEmailValid, setIsEmailValid] = useState(true);
  let [isPasswordValid, setIsPasswordValid] = useState(true);
  let lastNameRef = useRef<TextInputType>(null);
  let emailRef = useRef<TextInputType>(null);
  let passwordRef = useRef<TextInputType>(null);
  let dimensions = useDimensions();
  let { goBack } = useNavigation<StackNavProp<'EditProfile'>>();

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
  let saveChanges = () => {
    AsyncStorage.getItem('accessToken').then((customerAccessToken) => {
      if (customerAccessToken) {
        if (password === '') {
          updateCustomerData({
            variables: {
              email,
              customerAccessToken,
              firstName,
              lastName,
            },
          });
        } else {
          updateCustomerData({
            variables: {
              email,
              customerAccessToken,
              firstName,
              lastName,
              password,
            },
          });
        }
      }
    });
  };

  let [updateCustomerData, { loading: saving }] = useMutation<
    UpdateCustomerData,
    UpdateCustomerDataVariables
  >(UPDATE_CUSTOMER_DATA, {
    onCompleted() {
      // TODO: Update locally stored authenticatedUser
      goBack();
    },
  });

  let { loading } = useQuery<GetAuthenticatedUser>(GET_AUTHENTICATED_USER, {
    fetchPolicy: 'cache-only',
    notifyOnNetworkStatusChange: true,
    onCompleted({ authenticatedUser }) {
      let { email, firstName, lastName } = authenticatedUser;
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
    },
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  let isDisabled =
    !firstName || !lastName || !email || password.length > 0
      ? !isPasswordValid
      : false || !isEmailValid;
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContentContainer}
    >
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
              <TextInput
                label={t('First Name')}
                labelStyle={styles.textInputLabel}
                autoFocus={true}
                clearTextOnFocus={false}
                autoCapitalize="none"
                textContentType="name"
                mode="flat"
                value={firstName}
                onChangeText={setFirstName}
                containerStyle={styles.textInputContainer}
                returnKeyType="next"
                onSubmitEditing={() => {
                  lastNameRef.current && lastNameRef.current.focus();
                }}
              />
              <TextInput
                ref={lastNameRef}
                label={t('Last Name')}
                labelStyle={styles.textInputLabel}
                autoFocus={true}
                clearTextOnFocus={false}
                autoCapitalize="none"
                textContentType="name"
                mode="flat"
                value={lastName}
                onChangeText={setLastName}
                containerStyle={styles.textInputContainer}
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailRef.current && emailRef.current.focus();
                }}
              />
              <TextInput
                onFocus={() => {
                  setIsEmailValid(true);
                }}
                onBlur={() => {
                  setIsEmailValid(validateEmail(email));
                }}
                clearTextOnFocus={false}
                autoCapitalize="none"
                errorMessage={!isEmailValid ? INVALID_EMAIL_MESSAGE : undefined}
                ref={emailRef}
                label={t('Email Address')}
                labelStyle={styles.textInputLabel}
                textContentType="emailAddress"
                mode="flat"
                value={email}
                containerStyle={styles.textInputContainer}
                onChangeText={setEmail}
                errorMessageStyle={styles.errorMessage}
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordRef.current && passwordRef.current.focus();
                }}
              />
              <TextInput
                onFocus={() => {
                  setIsPasswordValid(true);
                }}
                onBlur={() => {
                  if (password.length > 0) {
                    setIsPasswordValid(validatePassword(password));
                  }
                }}
                ref={passwordRef}
                textContentType="password"
                autoCapitalize="none"
                errorMessage={
                  !isPasswordValid ? INVALID_PASSWORD_MESSAGE : undefined
                }
                label={t('Password')}
                labelStyle={styles.textInputLabel}
                secureTextEntry={true}
                mode="flat"
                value={password}
                onChangeText={setPassword}
                containerStyle={styles.textInputContainer}
                errorMessageStyle={styles.errorMessage}
                returnKeyType="next"
                onSubmitEditing={togglePickerVisible}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.buttonSaveContainer}>
          <Button
            disabled={isDisabled}
            onPress={saveChanges}
            loading={saving}
            style={defaultButton}
            labelStyle={defaultButtonLabel}
          >
            {t('Save Changes')}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  textInputLabel: {
    fontSize: FONT_SIZE.small,
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
  buttonSaveContainer: {
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: COLORS.red,
  },
  textInputContainer: {
    marginTop: 16,
    marginBottom: 4,
    paddingVertical: 8,
  },
  errorMessage: {
    padding: 0,
    marginTop: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
