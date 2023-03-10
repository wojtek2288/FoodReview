import { Card } from '@ui-kitten/components';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Rating } from '../Common/Rating';
import { useState } from 'react';
import ReviewResponse from '../../responseTypes/ReviewResponse';

interface ReviewCardProps {
  review: ReviewResponse;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <View style={styles.userContainer}>
      <Card style={styles.card} onPress={() => setExpand(!expand)}>
        <View style={styles.cardImage}>
          <Image
            style={styles.avatar}
            source={
              review.imageUrl == null
                ? require('../../assets/images/userEmpty.png')
                : { uri: review.imageUrl }
            }
          />
          <Text style={styles.username}>{review.username}</Text>
          <View style={styles.ratingContainer}>
            <Rating rating={review.rating} />
          </View>
        </View>
        {review.description === null || review.description === ''
          ? null
          : <View style={styles.cardDescription}>
            <Text style={styles.description}>
              {review.description.length > 100 && !expand
                ? review.description.substring(0, 100) + '...'
                : review.description}
            </Text>
          </View>}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    marginTop: '5 %',
  },
  card: {
    borderRadius: 10,
    width: '100 %',
  },
  cardDescription: {
    flex: 4,
  },
  cardImage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: '4 %',
  },
  description: {
    marginTop: '5 %',
    fontSize: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 1000,
  },
  ratingContainer: {
    flex: 0.5,
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
});
