import { Card } from '@ui-kitten/components';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Rating } from '../Common/Rating';
import Restaurant from '../../responseTypes/Restaurant';

interface RestaurantCardProps {
    restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant: dish }) => {
    return (
        <View style={styles.restaurantContainer}>
            <Card style={styles.card}>
                <View style={styles.cardContainer}>
                    <View style={styles.cardImage}>
                        <Image style={styles.restaurantImage} source={{ uri: dish.imageUrl }} />
                    </View>
                    <View style={styles.cardDescription}>
                        <Text style={styles.restaurantName}>
                            {dish.name}
                        </Text>
                    </View>
                    <View style={styles.cardRating}>
                        <Rating rating={dish.rating} />
                    </View>
                </View>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    restaurantContainer: {
        marginTop: '5 %',
        flexDirection: 'row',
    },
    card: {
        borderRadius: 10,
        width: '100 %',
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardDescription: {
        flex: 4,
        paddingLeft: '5 %'
    },
    cardImage: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardRating: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    restaurantName: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    restaurantImage: {
        width: '100 %',
        aspectRatio: 1,
        borderRadius: 10,
    }
});