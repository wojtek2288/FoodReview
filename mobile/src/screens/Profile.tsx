import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from 'react-native';
import Colors from '../constants/Colors';

export default function Profile() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <View style={styles.separator} />
            <EditScreenInfo path="/screens/Profile.tsx" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
        color: Colors.background,
    },
});
