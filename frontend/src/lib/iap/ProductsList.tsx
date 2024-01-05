import { View, Text, Button } from 'react-native';

import { useRevenueCat } from '../config/revenuecat';

const ProductsList = () => {
  const { packages, purchasePackage } = useRevenueCat();

  return (
    <View>
      {packages.map((pack) => {
        return (
          <View
            key={pack.identifier}
            className="flex flex-row justify-evenly items-center">
            <Text>{pack.identifier}</Text>
            <Text>{pack.product.title}</Text>
            <Text>{pack.product.priceString}</Text>
            <Button
              title="Buy"
              onPress={() => {
                purchasePackage(pack);
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

export default ProductsList;
