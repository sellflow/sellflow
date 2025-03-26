import { Image } from "expo-image";
import { Button } from "react-native";
import { Text, View } from "react-native";

export default function OrderDetails({ order }: { order: any }) {
  return (
    <View style={{ width: "100%", maxWidth: 640, gap: 8 }}>
      <View style={{ width: "100%" }}>
        <Text style={{ color: "white" }}>Order details</Text>
        <View
          style={{
            width: "100%",
            padding: 8,
            borderColor: "grey",
            borderWidth: 1,
            borderRadius: 4,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "white" }}>Order date</Text>
            <Text style={{ color: "white" }}>
              {new Date(order?.data?.order.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "white" }}>Order #</Text>{" "}
            <Text style={{ color: "white" }}>{order?.data?.order?.number}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "white" }}>Order total</Text>
            <Text style={{ color: "white" }}>
              ${order?.data?.order?.totalPrice?.amount}
            </Text>
          </View>
          <Button title="Cancel items" />
        </View>
      </View>
      {order?.data?.order.requiresShipping && (
        <>
          <View style={{ width: "100%" }}>
            <Text style={{ color: "white" }}>Shipment details</Text>
            <View
              style={{
                width: "100%",
                padding: 8,
                borderColor: "grey",
                borderRadius: 4,
                borderWidth: 1,
              }}
            >
              {order.data.order.lineItems.edges.map((item: any) => (
                <View
                  key={item.node.image.url}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Image
                      source={{ uri: item.node.image.url }}
                      style={{ width: 75, height: 75, borderRadius: 4 }}
                    />
                    <View style={{ gap: 4 }}>
                      <Text style={{ color: "white" }}>{item.node.name}</Text>
                      <Text style={{ color: "white" }}>
                        Quantity: {item.node.quantity}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: "white" }}>
                    ${item.node.price.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{ width: "100%" }}>
            <Text style={{ color: "white" }}>Shipping Address</Text>
            <View
              style={{
                width: "100%",
                padding: 8,
                borderColor: "grey",
                borderRadius: 4,
                borderWidth: 1,
              }}
            >
              <Text style={{ color: "white" }}>
                {order.data.order.shippingAddress.firstName}{" "}
                {order.data.order.shippingAddress.lastName}
              </Text>
              <Text style={{ color: "white" }}>
                {order.data.order.shippingAddress.address1}
              </Text>
              <Text style={{ color: "white" }}>
                {order.data.order.shippingAddress.formattedArea}
              </Text>
              <Text style={{ color: "white" }}>
                {order.data.order.shippingAddress.country}
              </Text>
            </View>
          </View>
        </>
      )}
      <View style={{ width: "100%", maxWidth: 640 }}>
        <Text style={{ color: "white" }}>Order Summary</Text>
        <View
          style={{
            width: "100%",
            borderWidth: 1,
            borderColor: "grey",
            borderRadius: 4,
            padding: 8,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "white" }}>Items:</Text>
            <Text style={{ color: "white" }}>
              ${order?.data.order.subtotal.amount}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "white" }}>Shipping & Handling: </Text>
            <Text style={{ color: "white" }}>
              ${order?.data.order.totalShipping.amount}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "white" }}>Total Tip: </Text>
            <Text style={{ color: "white" }}>
              ${order?.data.order.totalTip.amount}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "white" }}>Tax: </Text>
            <Text style={{ color: "white" }}>
              ${order?.data.order.totalTax.amount}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "white" }}>Total: </Text>
            <Text style={{ color: "white" }}>
              ${order?.data.order.totalPrice.amount}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
