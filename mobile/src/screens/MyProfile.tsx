import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Text, View, Image, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { ProfileTabScreenProps } from '../types';
import { Button, Popover, Spinner } from '@ui-kitten/components';
import { DishCard } from '../components/Dishes/DishCard';
import * as SecureStore from 'expo-secure-store';
import UserDetailsResponse from '../responseTypes/UserDetailsResponse';
import MyReviewResponse from '../responseTypes/MyReviewResponse';
import { defaultPageSize } from '../constants/Pagination';
import {
  useDeleteMyAccountCommand,
  useEditMyDescriptionCommand,
  useMyProfileQuery,
  useMyReviewsQuery,
  usePhotoUploadLinkQuery,
} from '../api/services';
import { RestaurantCard } from '../components/Restaurants/RestaurantCard';
import { EditDescriptionModal } from '../components/Users/EditDescriptionModal';
import { MyProfileDishCard } from '../components/Dishes/MyProfileDishCard';
import { MyProfileRestaurantCard } from '../components/Restaurants/MyProfileRestaurantCard';
import { DeleteAccountConfirmation } from '../components/Users/DeleteAccountConfirmation';
import * as ImagePicker from 'expo-image-picker';

export default function MyProfile({
  navigation,
}: ProfileTabScreenProps<'MyProfile'>) {
  const [token, setToken] = useState('');
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [user, setUser] = useState<UserDetailsResponse | undefined>(undefined);
  const [reviews, setReviews] = useState<MyReviewResponse[] | undefined>(
    undefined
  );
  const [refreshReviews, setRefreshReviews] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const detailsReq = {};
  const reviewsReq = {
    pageSize: defaultPageSize,
    pageCount: currentPage,
  };
  const editMyDescriptionReq = {
    description: '',
  };

  const { run: detailsRun, response: detailsResponse } =
    useMyProfileQuery(detailsReq);
  const {
    run: reviewsRun,
    response: reviewsResponse,
    isLoading: areReviewsLoading,
  } = useMyReviewsQuery(reviewsReq);
  const {
    run: editMyDescriptionRun,
    isLoading: editMyDescriptionLoading,
    requestSuccessful: editRequestSuccessful,
  } = useEditMyDescriptionCommand(editMyDescriptionReq);
  const {
    run: deleteMyAccountRun,
    isLoading: deleteMyAccountLoading,
    requestSuccessful: deleteMyAccountRequestSuccessful,
  } = useDeleteMyAccountCommand({});
  const photoUploadLink = usePhotoUploadLinkQuery({ extension: '' });

  const fetchData = async () => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token === null) {
      navigation.replace('Profile');
    } else {
      setToken(token);
      detailsRun(detailsReq, token);
      reviewsRun(reviewsReq, token);
    }
  };

  const removeTokens = async () => {
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('accessTokenExpiration');
    navigation.replace('Profile');
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setUser(detailsResponse);
  }, [detailsResponse]);

  useEffect(() => {
    if (reviewsResponse) {
      if (reviews !== undefined) {
        setReviews([...reviews, ...reviewsResponse.items]);
      } else {
        setReviews(reviewsResponse.items);
      }
      setCurrentPage(currentPage + 1);
      setTotalCount(reviewsResponse.totalCount);
    }
  }, [reviewsResponse]);

  useEffect(() => {
    if (editRequestSuccessful === true) {
      setDescriptionModalVisible(false);
      detailsRun(detailsReq, token);
    } else if (editRequestSuccessful === false) {
      setDescriptionModalVisible(false);
    }
  }, [editRequestSuccessful]);

  useEffect(() => {
    if (refreshReviews) {
      setRefreshReviews(false);
      setCurrentPage(0);
      setTotalCount(0);
      setReviews(undefined);
      reviewsRun(
        {
          pageSize: defaultPageSize,
          pageCount: 0,
        },
        token
      );
    }
  }, [refreshReviews]);

  useEffect(() => {
    if (deleteMyAccountRequestSuccessful === true) {
      removeTokens();
    }
  }, [deleteMyAccountRequestSuccessful]);

  const onEndReached = () => {
    if (
      currentPage * defaultPageSize >= totalCount ||
      currentPage == 0 ||
      areReviewsLoading
    ) {
      return;
    }
    reviewsRun(reviewsReq, token);
  };

  const onDescriptionEdited = (description: string) => {
    editMyDescriptionRun({ description }, token);
  };

  const onAccountDeleted = () => {
    deleteMyAccountRun({}, token);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.cancelled) {
      setSelectedImage(result.uri);
      const extension = result.uri.split('.').pop();
      if (extension !== undefined) {
        photoUploadLink.run({ extension: extension }, token);
      }
    }
  };

  useEffect(() => {
    if (photoUploadLink.response !== undefined) {
      uploadImage(photoUploadLink.response);
    }
  }, [photoUploadLink.response]);

  const uploadImage = async (blobUrl: string) => {
    setIsImageLoading(true);
    const extension = selectedImage.split('.').pop();
    const imageResponse = await fetch(selectedImage);
    const blob = await imageResponse.blob();
    const response = await fetch(blobUrl, {
      method: 'PUT',
      body: blob,
      headers: {
        'Content-Type': `image/${extension}`,
        'x-ms-blob-type': 'BlockBlob',
        'x-ms-blob-content-type': `image/${extension}`,
      },
    });
    if (response.ok) {
      setIsImageLoading(false);
      detailsRun(detailsReq, token);
    } else {
    }
  };

  return (
    <>
      {user === undefined ? (
        <View style={styles.container}>
          <Spinner status='warning' />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <>
              {descriptionModalVisible ? (
                <EditDescriptionModal
                  onClose={setDescriptionModalVisible}
                  isLoading={editMyDescriptionLoading}
                  onDescriptionEdited={onDescriptionEdited}
                  description={user.description}
                />
              ) : null}
              {deleteAccountModalVisible ? (
                <DeleteAccountConfirmation
                  onClose={setDeleteAccountModalVisible}
                  isLoading={deleteMyAccountLoading}
                  onAccountDelete={onAccountDeleted}
                />
              ) : null}
              <View style={styles.container}>
                <View style={styles.profile}>
                  <View style={styles.upperContainer}>
                    <View style={styles.avatarContainer}>
                      <TouchableOpacity
                        style={styles.editImageIcon}
                        onPress={pickImage}
                      >
                        <AntDesign name='edit' size={30} color='black' />
                      </TouchableOpacity>
                      {isImageLoading ? (
                        <Spinner status='warning' />
                      ) : (
                        <Image
                          style={styles.profileAvatar}
                          source={
                            user.imageUrl == null
                              ? require('../assets/images/userEmpty.png')
                              : { uri: user.imageUrl }
                          }
                        />
                      )}
                    </View>
                    <View style={styles.settingsContainer}>
                      <Popover
                        anchor={() => (
                          <Pressable
                            onPress={() => setPopoverVisible(true)}
                            style={({ pressed }) => ({
                              opacity: pressed ? 0.5 : 1,
                            })}
                          >
                            <AntDesign
                              name='down'
                              size={30}
                              color={Colors.darkText}
                            />
                          </Pressable>
                        )}
                        visible={popoverVisible}
                        placement='bottom end'
                        style={styles.popover}
                        onBackdropPress={() => setPopoverVisible(false)}
                      >
                        <>
                          <View style={styles.signOutContainer}>
                            <Pressable
                              onPress={async () => {
                                await SecureStore.deleteItemAsync(
                                  'refreshToken'
                                );
                                await SecureStore.deleteItemAsync(
                                  'accessToken'
                                );
                                await SecureStore.deleteItemAsync(
                                  'accessTokenExpiration'
                                );
                                navigation.replace('Profile');
                              }}
                            >
                              <Text style={styles.signOutText}>Sign Out</Text>
                            </Pressable>
                          </View>
                          <View style={styles.deleteAccountContainer}>
                            <Pressable
                              onPress={() => {
                                setPopoverVisible(false);
                                setDeleteAccountModalVisible(true);
                              }}
                            >
                              <Text style={styles.signOutText}>
                                Delete my account
                              </Text>
                            </Pressable>
                          </View>
                        </>
                      </Popover>
                    </View>
                  </View>
                  <Text style={styles.username}>{user.username}</Text>
                  <View style={styles.desciptionContainer}>
                    <Text style={styles.description}>{user.description}</Text>
                  </View>
                  <Button
                    onPress={() => setDescriptionModalVisible(true)}
                    style={styles.button}
                  >
                    Edit
                  </Button>
                </View>
                <View style={styles.ratings}></View>
              </View>
              <Text style={styles.headerText}>My Reviews:</Text>
            </>
          )}
          data={reviews}
          renderItem={(review) => (
            <View style={styles.card}>
              {review.item.dishReview !== null ? (
                <MyProfileDishCard
                  dish={review.item.dishReview}
                  navigation={navigation}
                  setRefreshReviews={setRefreshReviews}
                />
              ) : (
                <MyProfileRestaurantCard
                  restaurant={review.item.restaurantReview!}
                  navigation={navigation}
                  setRefreshReviews={setRefreshReviews}
                />
              )}
            </View>
          )}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    flex: 1.5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightBackground,
    width: '100 %',
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    paddingTop: '10 %',
    paddingBottom: '3 %',
  },
  upperContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '3 %',
    flexDirection: 'row',
    width: '100 %',
    height: '30 %',
  },
  avatarContainer: {
    flex: 1,
    marginLeft: 55,
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height * 0.15,
    // backgroundColor: 'red',
  },
  settingsContainer: {
    alignSelf: 'flex-start',
    marginLeft: 'auto',
    marginRight: 15,
  },
  profileAvatar: {
    flex: 1,
    width: '100 %',
    aspectRatio: 1,
    borderRadius: 1000,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: '3 %',
  },
  desciptionContainer: {
    marginBottom: '3 %',
  },
  description: {
    marginHorizontal: '10 %',
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.background,
    width: '50 %',
    borderColor: Colors.background,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: '5 %',
    marginLeft: '7.5 %',
  },
  ratings: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '85 %',
  },
  dishCard: {
    width: '85 %',
    alignSelf: 'center',
  },
  popover: {
    padding: 20,
    borderRadius: 10,
  },
  signOutContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  deleteAccountContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 20,
  },
  signOutText: {
    fontWeight: 'bold',
    color: 'white',
  },
  card: {
    width: '85 %',
    alignSelf: 'center',
  },
  editImageIcon: {
    marginBottom: '2 %',
  },
});
