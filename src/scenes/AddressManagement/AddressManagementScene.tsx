import React, { useCallback, useState } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, Image } from 'react-native';
import { Text, Button, ActivityIndicator } from 'exoflex';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';

import { ManageAddress } from '../../components';
import { defaultButton, defaultButtonLabel } from '../../constants/theme';
import { useGetCustomerAddresses } from '../../hooks/api/useCustomer';
import { AddressItem } from '../../types/types';
import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import {
  useCustomerAddressDelete,
  useCustomerSetDefaultAddress,
} from '../../hooks/api/useCustomerAddress';
import { emptyAddressImage } from '../../../assets/images';
import { useDimensions, ScreenSize } from '../../helpers/dimensions';

import { DeleteAddressModal } from './components/DeleteAddressModal';

export default function AddressManagementScene() {
  let { navigate } = useNavigation<StackNavProp<'AddressManagement'>>();
  let route = useRoute<StackRouteProp<'AddressManagement'>>();
  let { customerAccessToken } = route.params;
  let [addressId, setAddressId] = useState<string>('');
  let [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(
    false,
  );
  let { screenSize } = useDimensions();
  let first = screenSize === ScreenSize.Medium ? 10 : 5;

  let {
    addresses,
    loading: loadingAddresses,
    hasMore,
    isFetchingMore,
    refetch: refetchAddresses,
  } = useGetCustomerAddresses(first, customerAccessToken);

  let {
    customerAddressDelete,
    loading: loadingDeleteAddress,
  } = useCustomerAddressDelete({
    onCompleted: () => {
      refetchAddresses('update', { first, customerAccessToken, after: null });
    },
  });

  let {
    setDefaultAddress,
    loading: loadingSetDefaultAddress,
  } = useCustomerSetDefaultAddress({
    onCompleted: () => {
      refetchAddresses('update', { first, customerAccessToken, after: null });
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetchAddresses('update', { first, customerAccessToken, after: null });

      return undefined;
    }, []), // eslint-disable-line react-hooks/exhaustive-deps
  );

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

  let onEndReached = () => {
    if (!isFetchingMore && hasMore) {
      refetchAddresses('scroll', {
        first,
        customerAccessToken,
        after: addresses[addresses.length - 1].cursor || null,
      });
    }
  };

  let loading =
    loadingAddresses || loadingDeleteAddress || loadingSetDefaultAddress;
  if (loading && !isFetchingMore) {
    return <ActivityIndicator style={styles.centered} />;
  }

  return (
    <SafeAreaView style={styles.flex}>
      <DeleteAddressModal
        deleteVisible={isDeleteModalVisible}
        toggleModal={toggleDeleteModal}
        onPressCancel={onPressCancel}
        onPressDelete={() => onPressDelete(addressId)}
      />
      {addresses.length > 0 ? (
        <FlatList
          data={addresses}
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
          onEndReached={onEndReached}
          onEndReachedThreshold={0.25}
          ListFooterComponent={() => {
            return hasMore ? <ActivityIndicator /> : null;
          }}
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
