import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import api from '../utils/api';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';

interface Props {
  setIsClicked: (source: string) => void;
  setIsLoggedIn: (source: boolean) => void;
}

const custList = [
  { label: 'Garden State Ovens', value: 'GARDEN' },
  { label: 'International Machine Company', value: 'IMC' },
  { label: 'Mass Heat and Air', value: 'MASSHEAT' },
  { label: 'Northern Machine', value: 'NORTHERN' },
  { label: 'Production Engines Limited', value: 'PRODUCTION' },
  { label: 'Stockyard Conveyors', value: 'STKYARD' },
  { label: 'Toronto Tooling', value: 'TORONTO' },
  { label: 'Twin Cities Motor Company', value: 'TWINCITIES' },
];

const vehicleMap: { [key: string]: string[] } = {
  GARDEN: ['SBD2345C'],
  IMC: ['SBA1234A'],
  MASSHEAT: ['SBA1234A'],
  NORTHERN: ['SBA1234A'],
  PRODUCTION: ['SBA1234A'],
  STKYARD: ['SBF3456E'],
  TORONTO: ['SBH4567G'],
  TWINCITIES: ['SBH4567G'],
};

const partMap: { [key: string]: string[] } = {
  SBD2345C: ['001MP', 'CRNE-001-BSE'],
  SBA1234A: ['CRNE-002-BOM', 'TIPR-001-HYD'],
  SBF3456E: ['TIPR-002-BDY', 'TIPR-003-FRM'],
  SBH4567G: ['TIPR-004-HNG', 'TIPR-005-PMP'],
};

const lotMap: { [key: string]: string[] } = {
  '001MP': ['001MP_SN001'],
  'CRNE-001-BSE': ['AC001'],
  'CRNE-002-BOM': ['AC002', 'AC004'],
  'TIPR-001-HYD': ['AT001'],
  'TIPR-002-BDY': ['AT002'],
  'TIPR-003-FRM': ['AT003'],
  'TIPR-004-HNG': ['AT004'],
};

export const ServiceHomepage = ({ setIsClicked, setIsLoggedIn }: Props) => {
  const [isFocused, setIsFocused] = useState(true);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCust, setSelectedCust] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [selectedLot, setSelectedLot] = useState('');

  const fetchServiceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/BaqSvc/xSRV01_GetAllServiceCall/Data');
      const data = response.data?.value || [];
      setServiceData(data);
      Toast.show({
        type: 'success',
        text1: 'Data Loaded!',
        text2: `Total ${data.length} service calls 🎉`,
        position: 'top',
      });
    } catch (err: any) {
      console.error('API Error:', err.message);
      setError('Error fetching service data');
      Toast.show({
        type: 'error',
        text1: 'Fetch Failed',
        text2: 'Please check your connection or credentials.',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchServiceData();
    }
  }, [isFocused]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchServiceData();
    setRefreshing(false);
  }, []);

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('isLoggedIn');
      await SecureStore.deleteItemAsync('loginTimestamp');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.patch('/BaqSvc/xSRV01_APIGenerateSRO/Data', {
        Calculated_CustID: selectedCust,
        Calculated_VehicleNum: selectedVehicle,
        Calculated_PartNum: selectedPart,
        Calculated_LotNum: selectedLot,
      });
      Toast.show({
        type: 'success',
        text1: 'SRO Generated!',
        position: 'top',
      });
      setModalVisible(false);
      fetchServiceData();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Generate',
        text2: 'Please try again.',
        position: 'top',
      });
    }
  };

  const renderItem = (item: any) => (
    <View
      key={item.RowIdent}
      className="mb-3 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <Text className="text-sm font-semibold text-gray-800">Job: {item.Calculated_JobNum}</Text>
      <Text className="text-xs text-gray-500">
        {item.Calculated_CustID} - {item.Calculated_CustName}
      </Text>
      <Text className="mt-1 text-xs text-gray-600">Part: {item.Calculated_PartNum}</Text>
      <Text className="text-xs text-gray-600">Desc: {item.Calculated_LineDesc}</Text>
      <Text className="text-xs text-gray-600">Vehicle: {item.Calculated_VehicleNum}</Text>
      <Text className="text-xs text-gray-600">Service Lot: {item.Calculated_ServiceLotNum}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-4">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <TouchableOpacity className="mb-4 rounded bg-red-500 px-4 py-2" onPress={logout}>
          <Text className="text-center font-semibold text-white">Logout</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text className="text-red-500">{error}</Text>
        ) : serviceData.length > 0 ? (
          serviceData.map(renderItem)
        ) : (
          <Text>No service call data available</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6 rounded-full bg-blue-500 p-4 shadow-lg">
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 items-center justify-center bg-black bg-opacity-40">
          <View className="w-11/12 rounded-lg bg-white p-4">
            <Text className="mb-2 text-lg font-bold">Create SRO</Text>
            <Picker
              selectedValue={selectedCust}
              onValueChange={(value: string) => {
                setSelectedCust(value);
                setSelectedVehicle('');
                setSelectedPart('');
                setSelectedLot('');
              }}>
              <Picker.Item label="Select Customer" value="" />
              {custList.map((item) => (
                <Picker.Item label={item.label} value={item.value} key={item.value} />
              ))}
            </Picker>
            {selectedCust && (
              <Picker
                selectedValue={selectedVehicle}
                onValueChange={(value: string) => {
                  setSelectedVehicle(value);
                  setSelectedPart('');
                  setSelectedLot('');
                }}>
                <Picker.Item label="Select Vehicle" value="" />
                {vehicleMap[selectedCust]?.map((veh) => (
                  <Picker.Item label={veh} value={veh} key={veh} />
                ))}
              </Picker>
            )}
            {selectedVehicle && (
              <Picker
                selectedValue={selectedPart}
                onValueChange={(value: string) => {
                  setSelectedPart(value);
                  setSelectedLot('');
                }}>
                <Picker.Item label="Select Part" value="" />
                {partMap[selectedVehicle]?.map((part) => (
                  <Picker.Item label={part} value={part} key={part} />
                ))}
              </Picker>
            )}
            {selectedPart && (
              <Picker selectedValue={selectedLot} onValueChange={setSelectedLot}>
                <Picker.Item label="Select Lot" value="" />
                {lotMap[selectedPart]?.map((lot) => (
                  <Picker.Item label={lot} value={lot} key={lot} />
                ))}
              </Picker>
            )}
            <View className="mt-4 flex-row justify-between">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="rounded bg-gray-300 px-4 py-2">
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSubmit} className="rounded bg-blue-500 px-4 py-2">
                <Text className="text-white">Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
