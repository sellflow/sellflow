import React, { useCallback, useState } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Button, ActivityIndicator, Portal, Modal } from 'exoflex';
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
import { COLORS } from '../../constants/colors';
import { FONT_SIZE } from '../../constants/fonts';

export default function AddressManagementScene() {
  let { navigate } = useNavigation<StackNavProp<'AddressManagement'>>();
  let route = useRoute<StackRouteProp<'AddressManagement'>>();
  let { customerAccessToken } = route.params;

  let [addressId, setAddressId] = useState('');
  let [isVisible, setVisible] = useState(false);

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

  let addNewAddress = () => {
    navigate('AddEditAddress', { customerAccessToken });
  };

  let onPressEdit = (address: AddressItem) => {
    navigate('AddEditAddress', { address, customerAccessToken });
  };

  let onPressCancel = () => {
    setVisible(!isVisible);
  };

  let onPressDelete = async (id: string) => {
    setVisible(!isVisible);
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
    <SafeAreaView style={styles.container}>
      <Portal>
        <Modal
          contentContainerStyle={styles.modal}
          visible={isVisible}
          onDismiss={() => setVisible(!isVisible)}
        >
          <View style={styles.modalTitleContainer}>
            <Text weight="medium" style={styles.modalTitle}>
              {t('Delete Address')}
            </Text>
          </View>
          <Text style={styles.message}>
            {t(
              'Are you sure you want to delete this address? This action cannot be undone',
            )}
          </Text>
          <View style={styles.modalOptionContainer}>
            <Text
              weight="medium"
              style={styles.modalCancel}
              onPress={onPressCancel}
            >
              {t('No, Cancel')}
            </Text>

            <Text
              weight="medium"
              style={styles.modalDelete}
              onPress={() => onPressDelete(addressId)}
            >
              {t('Yes, Delete')}
            </Text>
          </View>
        </Modal>
      </Portal>
      {customerAddressData.length > 0 ? (
        <>
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
                  setVisible(!isVisible);
                }}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentContainer}
          />
          <Button
            onPress={addNewAddress}
            style={[defaultButton, styles.bottomButton]}
            labelStyle={defaultButtonLabel}
          >
            {t('Add New Address')}
          </Button>
        </>
      ) : (
        <View style={styles.centered}>
          <Text>{t('No Addresses To Display')}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.white,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalTitleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  modalTitle: {
    paddingVertical: 16,
    fontSize: FONT_SIZE.large,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginVertical: 24,
  },
  modalOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 38,
  },
  modalCancel: {
    color: COLORS.primaryColor,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
  },
  modalDelete: {
    color: COLORS.red,
    fontSize: FONT_SIZE.medium,
    textTransform: 'uppercase',
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
