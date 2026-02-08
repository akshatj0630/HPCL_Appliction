import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api } from '../api/client';
import type { Lead } from '../api/types';
import type { LeadsStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<LeadsStackParamList, 'LeadsHome'>;

function LeadRow({ lead, onPress }: { lead: Lead; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowHeader}>
        <Text style={styles.title} numberOfLines={2}>
          {lead.Title || lead.Full_Reference || lead.lead_id || lead._id}
        </Text>
        {lead.status ? <Text style={styles.badge}>{lead.status}</Text> : null}
      </View>
      <Text style={styles.company} numberOfLines={1}>
        {lead.Company_Name || lead.Company_Canonical || '—'}
      </Text>
      {lead.Closing_Date ? <Text style={styles.meta}>Closes: {lead.Closing_Date}</Text> : null}
    </Pressable>
  );
}

export default function LeadsScreen({ navigation }: Props) {
  const [data, setData] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = async () => {
    setError(null);
    try {
      const leads = await api.getLeads();
      setData(leads);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter(l => {
      const hay = [
        l.Title,
        l.Company_Name,
        l.Company_Canonical,
        l.HPCL_Products,
        l.Summary,
        l.Combined_Text,
        l.Full_Reference,
        l.lead_id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [data, query]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search leads..."
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        renderItem={({ item }) => (
          <LeadRow
            lead={item}
            onPress={() => navigation.navigate('LeadDetail', { id: item._id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No leads found</Text>}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  row: {
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  badge: {
    fontSize: 12,
    color: '#444',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  company: {
    marginTop: 6,
    color: '#333',
  },
  meta: {
    marginTop: 6,
    color: '#666',
    fontSize: 12,
  },
  error: {
    color: '#b00020',
  },
  empty: {
    color: '#666',
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
