import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api } from '../api/client';
import type { Company } from '../api/types';

function CompanyRow({ company }: { company: Company }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title} numberOfLines={2}>
        {company.canonical_name || company._id}
      </Text>
      {company.is_government !== undefined ? (
        <Text style={styles.meta}>{company.is_government ? 'Government' : 'Private'}</Text>
      ) : null}
      {company.total_signals !== undefined ? <Text style={styles.meta}>Signals: {company.total_signals}</Text> : null}
      {company.locations?.length ? (
        <Text style={styles.meta} numberOfLines={1}>
          {company.locations.join(', ')}
        </Text>
      ) : null}
    </View>
  );
}

export default function CompaniesScreen() {
  const [data, setData] = useState<Company[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = async () => {
    setError(null);
    try {
      const companies = await api.getCompanies();
      setData(companies);
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
    return (data ?? []).filter(c => {
      const hay = [c.canonical_name, ...(c.variants ?? []), ...(c.locations ?? [])]
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
        placeholder="Search companies..."
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        renderItem={({ item }) => <CompanyRow company={item} />}
        ListEmptyComponent={<Text style={styles.empty}>No companies found</Text>}
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
  title: {
    fontSize: 14,
    fontWeight: '800',
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
