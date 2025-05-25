import { storage } from "@/lib/storage";
import { getUserInfo, updateCustomerName } from "@/shopify/user";
import { Trans } from "@lingui/react/macro";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { discovery } from "@/lib/auth";
import Toast from "react-native-toast-message";
import { Redirect } from "expo-router";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

const userSchema = z.object({
  firstName: z
    .string()
    .max(32)
    .min(3, "First name length must be atleast three characters"),
  lastName: z
    .string()
    .max(32)
    .min(3, "Last name length must be atleast three characters"),
});

export default function Account() {
  const [idToken, setIdToken] = useMMKVString("idToken", storage);
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const [refreshToken, setRefreshToken] = useMMKVString(
    "refreshToken",
    storage,
  );

  const { isPending, isError, data, error } = useQuery({
    enabled: !!accessToken,
    queryKey: ["userAccount", accessToken],
    queryFn: async () => {
      if (accessToken) {
        const data = await getUserInfo(accessToken);
        const parsedData = await data.json();

        console.log(parsedData.data.customer.defaultAddress);
        return parsedData.data.customer;
      }
    },
  });

  const mutation = useMutation({
    mutationFn: ({
      firstName,
      lastName,
    }: {
      firstName: string;
      lastName: string;
    }) => {
      //@ts-ignore
      return updateCustomerName({ firstName, lastName, accessToken });
    },
  });

  //It's crazy that this my code actually matches the documentation exactly (for default values)
  const form = useForm({
    defaultValues: {
      firstName: data?.firstName ?? "",
      lastName: data?.lastName ?? "",
    },
    validators: {
      onChange: userSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  const logoutUser = async () => {
    const url = new URL(discovery.revocationEndpoint);
    url.searchParams.append("id_token_hint", idToken!);

    const res = await fetch(url);

    if (res.ok) {
      setAccessToken(undefined);
      setRefreshToken(undefined);
      setIdToken(undefined);
      Toast.show({
        type: "success",
        text1: "Successfully signed out",
        position: "bottom",
        bottomOffset: 60,
      });

      return <Redirect href="/" />;
    } else {
      Toast.show({
        type: "error",
        text1: "Failed to sign out",
        text2: "Please try again later.",
        position: "bottom",
        bottomOffset: 60,
      });
    }
  };

  return (
    <View style={styles.PageContainer}>
      {isPending ? (
        <UniActivityIndicator />
      ) : (
        <View style={styles.Container}>
          <Image
            style={styles.ProfilePicture}
            source={{ uri: data?.imageUrl }}
          />
          <View>
            <form.Field name="firstName">
              {(field) => (
                <>
                  <Text style={styles.UserInfoHeading}>
                    <Trans>First Name:</Trans>
                  </Text>
                  <UniTextInput
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    style={styles.UserInfoHeading}
                  />
                  {!field.state.meta.isValid && (
                    <Text style={{ color: "red" }}>
                      {field.state.meta.errors.join(", ")}
                    </Text>
                  )}
                </>
              )}
            </form.Field>
          </View>
          <View>
            <form.Field name="lastName">
              {(field) => (
                <>
                  <Text style={styles.UserInfoHeading}>
                    <Trans>First Name:</Trans>
                  </Text>
                  <UniTextInput
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    style={styles.UserInfoHeading}
                  />
                  {!field.state.meta.isValid && (
                    <Text style={{ color: "red" }}>
                      {field.state.meta.errors.join(", ")}
                    </Text>
                  )}
                </>
              )}
            </form.Field>
          </View>
          <View>
            <Text style={styles.UserInfoHeading}>
              <Trans>Phone Number:</Trans>
            </Text>
            <Text style={styles.UserInfo}>
              {data?.phoneNumber?.phoneNumber}
            </Text>
          </View>
          <View>
            <Text style={styles.UserInfoHeading}>
              <Trans>Email Address:</Trans>
            </Text>
            <Text style={styles.UserInfo}>
              {data?.emailAddress?.emailAddress}
            </Text>
          </View>
          <View>
            <Text style={styles.UserInfoHeading}>
              <Trans>Default Address: </Trans>
            </Text>
            <Text style={styles?.UserInfo}>
              {data?.defaultAddress?.address1}
            </Text>
          </View>
          <Pressable
            onPress={logoutUser}
            style={({ pressed }) => [
              styles.SaveButton,
              {
                opacity: pressed ? 70 : 100,
              },
            ]}
          >
            <Text style={styles.SaveButtonText}>
              <Trans>Sign out</Trans>
            </Text>
          </Pressable>
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isDirty,
            ]}
            children={([canSubmit, isSubmitting, isDirty]) =>
              isDirty && (
                <Pressable
                  disabled={!canSubmit || isSubmitting}
                  onPress={() => form.handleSubmit()}
                  style={({ pressed }) => [
                    styles.SaveButton,
                    {
                      opacity: pressed || isSubmitting ? 70 : 100,
                    },
                  ]}
                >
                  {isSubmitting || mutation.isPending ? (
                    <UniActivityIndicator />
                  ) : (
                    <Text style={styles.SaveButtonText}>
                      <Trans>Save changes</Trans>
                    </Text>
                  )}
                </Pressable>
              )
            }
          />
        </View>
      )}
    </View>
  );
}

const UniActivityIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.colors.text,
}));

const UniTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.colors.text,
}));

const styles = StyleSheet.create((theme) => ({
  PageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  Container: {
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    gap: 24,
  },
  ProfilePicture: {
    alignSelf: "center",
    width: 100,
    height: 100,
  },
  UserInfoHeading: {
    fontSize: 18,
    marginBottom: 4,
    color: theme.colors.text,
  },
  UserInfo: {
    fontWeight: 600,
    color: theme.colors.text,
  },
  SaveButton: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 8,
    backgroundColor: theme.colors.red,
  },
  SaveButtonText: {
    fontWeight: 600,
    color: theme.colors.text,
  },
}));
