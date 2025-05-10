import { i18n } from "@lingui/core";
import { Text } from "react-native";
import { getLocales } from "expo-localization";
import { TransRenderProps } from "@lingui/react";
import { messages as esMessages } from "@/locales/es/messages";
import { messages as enMessages } from "@/locales/en/messages";

const locales = getLocales();
let languageCode = locales[0].languageCode || "en";

i18n.load({
  en: enMessages,
  es: esMessages,
});
i18n.activate(languageCode);

const DefaultComponent = (props: TransRenderProps) => (
  <Text>{props.children}</Text>
);

export { i18n, DefaultComponent };
