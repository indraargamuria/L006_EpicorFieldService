import { Text, View } from 'react-native';

export const Homepage = () => {
  return (
    <View className={styles.container}>
        <Text>Homepage</Text>
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold text-color-500`,
};
