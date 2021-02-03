import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'exoflex';

import { CheckoutAddress } from '../../../components';
import { AddressItem } from '../../../types/types';

type Props = {
  addresses: Array<AddressItem>;
  selectedAddress: AddressItem;
  onSelectAddress: (item: AddressItem) => void;
  onEditAddress: (item: AddressItem) => void;
  onEndReached: (info: { distanceFromEnd: number }) => void;
  hasMore: boolean;
};

export default function AdddressList(props: Props) {
  let {
    addresses,
    selectedAddress,
    onSelectAddress,
    onEditAddress,
    onEndReached,
    hasMore,
  } = props;

  return (
    <FlatList
      data={addresses}
      renderItem={({ item, index }) => (
        <CheckoutAddress
          data={item}
          style={index !== addresses.length - 1 && styles.checkoutAddress}
          isSelected={selectedAddress.id === item.id}
          onSelect={() => onSelectAddress(item)}
          onEditPressed={() => onEditAddress(item)}
        />
      )}
      keyExtractor={(data) => data.id.toString()}
      showsVerticalScrollIndicator={false}
      style={styles.addressList}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.25}
      ListFooterComponent={() => {
        return hasMore ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : null;
      }}
      ListEmptyComponent={() => {
        return hasMore ? null : (
          <View style={styles.center}>
            <Text>{t('No address yet')}</Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  addressList: {
    marginTop: 12,
  },
  checkoutAddress: { marginBottom: 12 },
  activityIndicator: {
    marginVertical: 24,
  },
  center: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
