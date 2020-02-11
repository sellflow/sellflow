import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Button, ActivityIndicator } from 'exoflex';

import { ManageAddress } from '../components';
import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { useGetCustomerData } from '../hooks/api/useCustomer';
import { AddressItem } from '../types/types';
import { useCustomerAddressDelete } from '../hooks/api/useCustomerAddress';
import * as authToken from '../helpers/authToken';

export default function AddressManagementScene() {
  let [token, setToken] = useState('');
  let [customerData, setCustomerData] = useState<Array<AddressItem>>([]);

  let {
    getCustomer,
    loading: getCustomerLoading,
    refetch: refetchGetCustomer,
  } = useGetCustomerData({
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ customer }) => {
      if (customer) {
        let defaultAddress = customer.defaultAddress;

        let newCustomerData: Array<AddressItem> = customer.addresses.edges.map(
          (item) => ({
            id: item.node.id,
            name: item.node.name,
            address1: item.node.address1,
            city: item.node.city,
            province: item.node.province,
            zip: item.node.zip,
            country: item.node.country,
            phone: item.node.phone,
            default: item.node.id === defaultAddress?.id && true,
          }),
        );

        setCustomerData(newCustomerData);
      }
    },
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

  useEffect(() => {
    let getCustomerToken = async () => {
      let customerToken = await authToken.getToken();

      if (customerToken) {
        setToken(customerToken);
        getCustomer({
          variables: { accessToken: customerToken },
        });
      } else {
        return;
      }
    };

    getCustomerToken();
  }, [getCustomer]);

  let addNewAddress = () => Alert.alert('Add New', 'ToDo Routing'); //TODO Routing to Add Scene

  let onPressEdit = () => Alert.alert('Edit', 'Edit Address with ID '); //TODO API WITH ID

  let onPressDelete = async (addressId: string) => {
    await customerAddressDelete({
      variables: { id: addressId, customerAccessToken: token },
    });
  };

  let onPressSetPrimary = () =>
    Alert.alert('Set Primary', 'Set Primary Address with ID ');

  if (getCustomerLoading || loadingDeleteAddress) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {customerData.length > 0 ? (
        <>
          <FlatList
            data={customerData}
            renderItem={({ item }) => (
              <ManageAddress
                data={item}
                style={styles.item}
                onPressSetPrimary={onPressSetPrimary}
                onPressEdit={onPressEdit}
                onPressDelete={onPressDelete}
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
            {t('Add new address')}
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
  item: {
    marginTop: 16,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  bottomButton: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 10,
  },
});
