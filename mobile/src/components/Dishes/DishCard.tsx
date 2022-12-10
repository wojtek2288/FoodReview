import Dish from '../../types/Dish';
import { Card } from '@ui-kitten/components';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Rating } from '../Common/Rating';

interface DishCardProps {
    dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
    return (
        <View style={styles.dishContainer}>
            <Card style={styles.card}>
                <View style={styles.cardContainer}>
                    <View style={styles.cardImage}>
                        <Image style={styles.dishImage} source={{ uri: dish.imageUrl }} />
                    </View>
                    <View style={styles.cardDescription}>
                        <Text style={styles.dishName}>
                            {dish.name}
                        </Text>
                        <Text style={styles.restaurantName}>
                            {dish.restaurantName}
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
    dishContainer: {
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
    dishName: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    restaurantName: {
        marginTop: '10 %',
        fontSize: 18,
    },
    dishImage: {
        width: '100 %',
        aspectRatio: 1,
        borderRadius: 10,
    }
});