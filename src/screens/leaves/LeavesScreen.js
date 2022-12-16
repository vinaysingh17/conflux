import {View, Text, Alert} from 'react-native';
import React from 'react';
import LeavesHeader from './LeavesHeader';
import {commonStyles} from '../../utils/styles';
import {StyleSheet} from 'react-native';
import {TouchableHighlight} from 'react-native';
import {Image} from 'react-native';
import {ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import {getAllLeaves, getAvailableLeaves} from '../../utils/API';
import {ActivityIndicator} from 'react-native-paper';
import {useState} from 'react';
import {COLORS} from '../../utils/theme';
import {useIsFocused} from '@react-navigation/native';

export default function LeavesScreen({navigation}) {
  const {userData} = useSelector(state => state.User);
  const [allLeaves, setAllLeaves] = React.useState([]);
  const [showLoader, setShowLoader] = useState();
  // const [, set] = useState(second)
  const isFocused = useIsFocused();
  const countType = type => {
    const filtered = allLeaves.filter(item => item.leave_type == type);
    return filtered.length;
  };
  const [available, setAvailable] = useState([
    {
      'Sick Leave': 0,
    },
    {'Casual Leave': 0},
    {'Privilege Leave': 0},
  ]);

  useEffect(() => {
    // getAllLeaves(userData.staffid, res => {
    getAvailableLeaves(userData.staffid, res => {
      // getAvailableLeaves(392, res => {
      // Alert.alert('here');
      setAvailable(res.body);
      console.log(res, '<<<<  \n\n\n\n\n\n available \n\n\n\n Leave');
    });
    setShowLoader('.');
    // getAllLeaves(392, res => {
    getAllLeaves(userData.staffid, res => {
      // getAllLeaves(110, res => {
      console.log(res.body, '\n\n\n\n<<<<result at get all leaves');
      setAllLeaves(res.body);

      if (res.body.length == 0) {
        setShowLoader('..');
      }
    });
  }, [isFocused]);

  return (
    <View
      style={{
        marginBottom: 30,
        backgroundColor: '#fff',
      }}>
      <LeavesHeader navigation={navigation} />

      <ScrollView style={{width: '100%', height: '100%'}}>
        <View style={{alignItems: 'center', marginTop: 22}}>
          <Text style={{...commonStyles.fs14_400, color: '#0073FF'}}>
            Leaves Applied
          </Text>
        </View>

        <View style={styles.leaveContainer}>
          <RenderLeaveCount
            count={
              available[0]['Sick Leave'] != null
                ? available[0]['Sick Leave']
                : 0
            }
            // count={countType('Sick Leave')}
            title={`Sick Leave`}
            // title={`Sick\nLeave`}
            bgColor="#E8EBFB"
            color="#235FDD"
          />

          <RenderLeaveCount
            count={
              available[1]['Casual Leave'] != null
                ? available[1]['Casual Leave']
                : 0
            }
            title={`Casual Leave`}
            bgColor="#FDF5E3"
            color="#F3A41D"
          />

          <RenderLeaveCount
            count={
              available[2]['Privilege Leave'] != null
                ? available[2]['Privilege Leave']
                : 0
            }
            title={`Privilege Leave`}
            bgColor="#FBEEE9"
            color="#E75E40"
          />
        </View>

        <TouchableHighlight
          style={styles.applyBtn}
          underlayColor="#0073FF"
          onPress={() => {
            navigation.navigate('ApplyLeavesScreen');
          }}>
          <Text style={{...commonStyles.fs16_400, color: '#fff'}}>
            Apply
            <Text style={{fontSize: 7}}>{showLoader}</Text>
            Leave
          </Text>
        </TouchableHighlight>
        {showLoader == 0 && (
          <View>
            <ActivityIndicator />
          </View>
        )}
        {showLoader == 2 && (
          <Text
            style={{
              ...commonStyles.fs16_400,
              color: COLORS.blue,
              textAlign: 'center',
              marginTop: 20,
            }}>
            No leave applied yet !
          </Text>
        )}
        <View style={{padding: 16}}>
          {/* {['SL', 'FL', 'PL', 'PL', 'SL', 'FL', 'PL', 'PL'].map( */}

          {showLoader == 1 &&
            allLeaves.map((item, index) => {
              var bgColor = '';
              // if (item === 'SL') {
              //   bgColor = '#E8EBFB';
              // } else if (item === 'CL') {
              //   bgColor = '#F6E9E4';
              // } else if (item === 'PL') {
              //   bgColor = '#FDF5E3';
              // }
              return (
                <View
                  style={[
                    styles.leaveShowContainer,
                    {backgroundColor: bgColor},
                  ]}
                  key={index}>
                  <View style={{...commonStyles.rowBetween}}>
                    <View style={{...commonStyles.rowStart}}>
                      <Text
                        style={{...commonStyles.fs16_700, color: '#1C67F6'}}>
                        {item.leave_type}
                      </Text>
                      <Image
                        source={require('../../assets/img/check.png')}
                        style={{width: 12, height: 12, marginLeft: 4}}
                      />
                    </View>
                    <Text style={{...commonStyles.fs12_400}}>
                      {new Date(item.start_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={{...commonStyles.fs14_500}}>
                    Duration:{' '}
                    {item.leave_duration == 0 ? 1 : item.leave_duration} day(s)
                  </Text>
                  <Text style={{...commonStyles.fs14_500}}>
                    Reason: {item.reason}
                  </Text>
                </View>
              );
            })}
        </View>

        <View style={{height: 70}} />
      </ScrollView>
    </View>
  );
}

const RenderLeaveCount = ({count, title, bgColor, color}) => {
  return (
    <View
      style={{
        ...styles.leaveCount,
        backgroundColor: bgColor,
        // borderWidth: 1,
        marginHorizontal: 4,
      }}>
      <Text style={{...commonStyles.fs26_700, color: color}}>{count}</Text>
      <Text
        style={{...commonStyles.fs14_500, textAlign: 'center', color: color}}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  leaveContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    // justifyContent: 'space-between',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 22,
    // marginHorizontal: 10,
  },
  leaveCount: {
    width: '31%',
    padding: 10,
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 12,
  },
  applyBtn: {
    width: '50%',
    height: 40,
    backgroundColor: '#1C67F6',
    ...commonStyles.centerStyles,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  leaveShowContainer: {
    borderWidth: 1,
    borderColor: '#1C67F6',
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#E8EBFB',
    marginTop: 14,
  },
});
