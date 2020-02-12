import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, Text } from 'exoflex';

import { OrderHistoryItem } from '../components';
import { StackNavProp, StackRouteProp } from '../types/Navigation';
import { useOrderHistoryQuery } from '../hooks/api/useOrderHistory';

export default function OrderHistoryScene() {
  let { navigate } = useNavigation<StackNavProp<'OrderHistory'>>();
  let { params } = useRoute<StackRouteProp<'OrderHistory'>>();
  let orders = useOrderHistoryQuery({
    variables: { customerAccessToken: params.customerAccessToken },
  });

  if (orders.length < 1) {
    return <ActivityIndicator style={styles.center} />;
  }
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => (
        <OrderHistoryItem
          order={item}
          onPress={() => navigate('OrderDetails', { order: item })}
        />
      )}
      keyExtractor={(item) => item.orderID}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={() => (
        <View style={styles.center}>
          <Text>{t('No orders yet')}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
});
