import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('home'); // home | rider | rider_wait | driver
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [requests, setRequests] = useState([]);

  function sendRequest() {
    if (!location) return Alert.alert('خطأ', 'اكتب مكانك الحالي');
    const id = Date.now().toString();
    const req = { id, passengerName: name || 'راكب', location, destination: destination || 'غير محدد', fare: 15, status: 'pending' };
    setRequests(prev => [req, ...prev]);
    setScreen('rider_wait');
  }

  function cancelRequest(id) {
    setRequests(prev => prev.filter(r => r.id !== id));
    setScreen('home');
    setLocation('');
    setDestination('');
  }

  function driverAccept(id) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
    Alert.alert('تم القبول', 'انت قبلت الطلب');
  }

  function driverFinish(id) {
    setRequests(prev => prev.filter(r => r.id !== id));
    Alert.alert('انتهت الرحلة', 'شكراً - تم حذف الطلب');
  }

  // Screens
  if (screen === 'rider') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>👤 شاشة الراكب</Text>
        <TextInput style={styles.input} placeholder="اسمك (اختياري)" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="مكانك الآن (مثال: عند المدرسة)" value={location} onChangeText={setLocation} />
        <TextInput style={styles.input} placeholder="الوجهة (اختياري)" value={destination} onChangeText={setDestination} />
        <TouchableOpacity style={styles.btnYellow} onPress={sendRequest}><Text style={styles.btnYellowText}>اطلب توك توك — 15 ج</Text></TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('home')}><Text style={styles.backText}>⬅ رجوع</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'rider_wait') {
    const last = requests[0];
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>في انتظار قبول السائق</Text>
        {last ? (
          <View style={styles.card}>
            <Text style={styles.bold}>{last.passengerName}</Text>
            <Text style={styles.subtle}>مكان: {last.location}</Text>
            <Text style={styles.subtle}>وجهة: {last.destination}</Text>
            <Text style={styles.subtle}>أجرة: {last.fare} ج</Text>
            <View style={{flexDirection:'row', marginTop:12}}>
              <TouchableOpacity style={[styles.btn, {backgroundColor:'#d9534f', flex:1, marginRight:8}]} onPress={() => cancelRequest(last.id)}><Text style={styles.btnText}>إلغاء</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, {backgroundColor:'#FFD400', flex:1}]} onPress={() => Alert.alert('تحديث','سنجرب تحديث الحالة')}><Text style={[styles.btnText, {color:'#000'}]}>تحديث</Text></TouchableOpacity>
            </View>
          </View>
        ) : <Text style={styles.subtle}>لا توجد طلبات الآن.</Text>}
        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('home')}><Text style={styles.backText}>⬅ رجوع للرئيسية</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'driver') {
    const pending = requests.filter(r => r.status === 'pending');
    const accepted = requests.find(r => r.status === 'accepted');
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>🛵 لوحة السائق</Text>
        <Text style={styles.subtle}>طلبات متاحة: {pending.length}</Text>
        <ScrollView style={{marginTop:10, width:'100%'}}>
          {pending.length === 0 && <Text style={styles.subtle}>لا توجد طلبات الآن.</Text>}
          {pending.map(r => (
            <View key={r.id} style={styles.request}>
              <Text style={styles.bold}>{r.passengerName}</Text>
              <Text style={styles.subtle}>{r.location} → {r.destination}</Text>
              <Text style={styles.subtle}>أجرة: {r.fare} ج</Text>
              <View style={{flexDirection:'row', marginTop:8}}>
                <TouchableOpacity style={[styles.btn, {backgroundColor:'#FFD400', flex:1, marginRight:8}]} onPress={() => driverAccept(r.id)}><Text style={[styles.btnText, {color:'#000'}]}>قبول</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, {backgroundColor:'#fff', borderWidth:1, borderColor:'#ddd', flex:1}]} onPress={() => setRequests(prev => prev.filter(x => x.id !== r.id))}><Text style={[styles.btnText, {color:'#333'}]}>رفض</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {accepted && (
          <View style={{marginTop:12, width:'100%'}}>
            <Text style={styles.bold}>رحلة مقبولة</Text>
            <Text style={styles.subtle}>{accepted.passengerName} — {accepted.location}</Text>
            <View style={{flexDirection:'row', marginTop:8}}>
              <TouchableOpacity style={[styles.btn, {backgroundColor:'#000', flex:1, marginRight:8}]} onPress={() => driverFinish(accepted.id)}><Text style={styles.btnText}>انتهاء الرحلة</Text></TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('home')}><Text style={styles.backText}>⬅ رجوع للرئيسية</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Home
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>توك توك بلدنا</Text>
      <Text style={styles.subtitle}>اختار دورك</Text>

      <TouchableOpacity style={[styles.bigButton, {backgroundColor:'#FFD400'}]} onPress={() => setScreen('rider')}><Text style={[styles.bigText, {color:'#000'}]}>🚖 راكب</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.bigButton, {backgroundColor:'#222'}]} onPress={() => setScreen('driver')}><Text style={styles.bigText}>🛵 سائق</Text></TouchableOpacity>

      <Text style={styles.subtle}>طلبات حالية: {requests.length}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor:'#000', alignItems:'center', padding:18, paddingTop:40},
  logo: {color:'#FFD400', fontSize:30, fontWeight:'800', marginBottom:6},
  subtitle: {color:'#fff', fontSize:18, marginBottom:20},
  bigButton: {width:'90%', padding:16, borderRadius:12, alignItems:'center', marginBottom:12},
  bigText: {fontSize:20, color:'#FFD400', fontWeight:'700'},
  heading: {fontSize:20, color:'#FFD400', fontWeight:'700', marginBottom:8},
  input: {width:'100%', backgroundColor:'#fff', padding:10, borderRadius:8, marginBottom:10},
  btnYellow: {width:'100%', padding:14, backgroundColor:'#FFD400', borderRadius:10, alignItems:'center'},
  btnYellowText: {color:'#000', fontWeight:'700'},
  btn: {padding:12, borderRadius:10, alignItems:'center'},
  btnText: {color:'#fff', fontWeight:'700'},
  backBtn: {marginTop:14},
  backText: {color:'#fff', textDecorationLine:'underline'},
  small: {color:'#bbb', marginTop:16},
  subtle: {color:'#bbb'},
  request: {backgroundColor:'#111', padding:10, borderRadius:8, marginBottom:8, width:'100%'},
  bold: {color:'#fff', fontWeight:'700'},
  card: {backgroundColor:'#111', padding:12, borderRadius:10, width:'100%', marginTop:10}
});
