import React, { useCallback, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { emptyAddressImage } from '../../../assets/images';
import { ErrorPage, ManageAddress } from '../../components';
import { defaultButton, defaultButtonLabel } from '../../constants/theme';
import { Button, Text } from '../../core-ui';
import { ScreenSize, useDimensions } from '../../helpers/dimensions';
import { useGetCustomerAddresses } from '../../hooks/api/useCustomer';
import {
  useCustomerAddressDelete,
  useCustomerSetDefaultAddress,
} from '../../hooks/api/useCustomerAddress';
import { StackNavProp, StackRouteProp } from '../../types/Navigation';
import { AddressItem } from '../../types/types';

import { DeleteAddressModal } from './components';

export default function AddressManagementScene() {
  let { navigate } = useNavigation<StackNavProp<'AddressManagement'>>();
  let {
    params: { customerAccessToken },
  } = useRoute<StackRouteProp<'AddressManagement'>>();
  let [addressId, setAddressId] = useState('');
  let [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  let { screenSize } = useDimensions();
  let first = screenSize === ScreenSize.Medium ? 10 : 5;

  let {
    addresses,
    error,
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

  if (error) {
    return (
      <ErrorPage
        onRetry={() => {
          refetchAddresses('update', {
            first,
            customerAccessToken,
            after: null,
          });
        }}
      />
    );
  }

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
