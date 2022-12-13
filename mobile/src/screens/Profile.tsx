import React from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';
import { Text, View, Image, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { RootTabScreenProps } from '../types';
import { users } from '../data/users';
import { Button } from '@ui-kitten/components';
import { dishes } from '../data/dishes';
import { DishCard } from '../components/Dishes/DishCard';

export default function Profile({ navigation }: RootTabScreenProps<'Profile'>) {
    var user = users[0];

    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <View style={styles.upperContainer}>
                    <View style={styles.avatarContainer}>
                        <Image style={styles.profileAvatar} source={user.imageUrl == null
                            ? require('../assets/images/userEmpty.png')
                            : { uri: user.imageUrl }} />
                    </View>
                    <View style={styles.settingsContainer}>
                        <Pressable
                            onPress={() => navigation.navigate('Modal')}
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}>
                            <AntDesign name="setting" size={40} color={Colors.darkText} />
                        </Pressable>
                    </View>
                </View>
                <Text style={styles.username}>{user.username}</Text>
                <ScrollView style={styles.desciptionContainer}>
                    <Text style={styles.description}>
                        {user.description}
                    </Text>
                </ScrollView>
                <Button onPress={() => navigation.navigate('Modal')} style={styles.button}>Edit</Button>
            </View>
            <View style={styles.ratings}>
                <FlatList
                    ListHeaderComponent={() => <Text style={styles.headerText}>My Reviews:</Text>}
                    data={dishes}
                    renderItem={(dish) => {
                        return (
                            <DishCard dish={dish.item} />
                        );
                    }}
                    keyExtractor={(item, index) => {
                        return item.id.toString();
                    }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
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
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
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
        height: '30 %'
    },
    avatarContainer: {
        flex: 1,
        marginLeft: 55,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100 %',
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
        textAlign: 'center'
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
    },
    ratings: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: '85 %',
    }
});
