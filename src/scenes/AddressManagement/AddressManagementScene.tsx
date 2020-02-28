import React, { useCallback, useState } from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Text, Button, ActivityIndicator } from 'exoflex';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';

import { ManageAddress } from '../../components';
import { defaultButton, defaultButtonLabel } from '../../constants/theme';
import { useGetCustomerData } from '../../hooks/api/useCustomer';
import { AddressItem } from '../../types/types';
import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import {
  useCustomerAddressDelete,
  useCustomerSetDefaultAddress,
} from '../../hooks/api/useCustomerAddress';
import { DeleteAddressModal } from './components/DeleteAddressModal';
import { emptyAddressImage } from '../../../assets/images';

export default function AddressManagementScene() {
  let { navigate } = useNavigation<StackNavProp<'AddressManagement'>>();
  let route = useRoute<StackRouteProp<'AddressManagement'>>();
  let { customerAccessToken } = route.params;

  let [addressId, setAddressId] = useState<string>('');
  let [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(
    false,
  );

  let {
    getCustomer,
    customerAddressData,
    loading: getCustomerLoading,
    refetch: refetchGetCustomer,
  } = useGetCustomerData({
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  let {
    customerAddressDelete,
    loading: loadingDeleteAddress,
  } = useCustomerAddressDelete({
    onError: (error) => {
      Alert.alert(error.message);
    },
    onCompleted: () => {
      refetchGetCustomer();
    },
  });

  let {
    setDefaultAddress,
    loading: loadingSetDefaultAddress,
  } = useCustomerSetDefaultAddress({
    onError: (error) => {
      Alert.alert(error.message);
    },
    onCompleted: () => {
      refetchGetCustomer();
    },
  });

  //TODO: Typing error bug from react navigation
  let focusEffect = useCallback(() => {
    getCustomer({
      variables: { accessToken: customerAccessToken },
    });

    return undefined;
  }, [getCustomer, customerAccessToken]);

  useFocusEffect(focusEffect);

  let toggleDeleteModal = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
  };

  let addNewAddress = () => {
    navigate('AddEditAddress', { rootScene: 'AddressManagement' });
  };

  let onPressEdit = (address: AddressItem) => {
    navigate('AddEditAddress', { address, rootScene: 'AddressManagement' });
  };

  let onPressCancel = () => {
    toggleDeleteModal();
  };

  let onPressDelete = async (id: string) => {
    toggleDeleteModal();
    await customerAddressDelete({
      variables: {
        id,
        customerAccessToken,
      },
    });
  };

  let onPressSetPrimary = async (addressId: string) => {
    await setDefaultAddress({
      variables: { customerAccessToken, addressId },
    });
  };

  if (getCustomerLoading || loadingDeleteAddress || loadingSetDefaultAddress) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <SafeAreaView style={styles.flex}>
      <DeleteAddressModal
        deleteVisible={isDeleteModalVisible}
        toggleModal={toggleDeleteModal}
        onPressCancel={onPressCancel}
        onPressDelete={() => onPressDelete(addressId)}
      />
      {customerAddressData.length > 0 ? (
        <FlatList
          data={customerAddressData}
          renderItem={({ item }) => (
            <ManageAddress
              data={item}
              style={styles.item}
              onPressSetPrimary={onPressSetPrimary}
              onPressEdit={() => onPressEdit(item)}
              onPressDelete={() => {
                setAddressId(item.id);
                toggleDeleteModal();
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
        />
      ) : (
        <View style={[styles.centered, styles.imageContainer]}>
          <Image
            source={emptyAddressImage}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.message}>
            {t('Address is Empty. Please add new address')}
          </Text>
        </View>
      )}
      <Button
        onPress={addNewAddress}
        style={[defaultButton, styles.bottomButton]}
        labelStyle={defaultButtonLabel}
      >
        {t('Add New Address')}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginHorizontal: 60,
  },
  image: {
    width: '100%',
    height: 180,
  },
  message: {
    textAlign: 'center',
    marginVertical: 24,
  },
  item: {
    marginTop: 16,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  bottomButton: {
    margin: 24,
  },
});
