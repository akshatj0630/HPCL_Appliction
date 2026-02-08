import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../api/client';
import type { Company, Lead } from '../api/types';

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setError(null);
    try {
      const [l, c] = await Promise.all([api.getLeads(), api.getCompanies()]);
      setLeads(l);
      setCompanies(c);
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

  const stats = useMemo(() => {
    const totalLeads = leads?.length ?? 0;
    const newLeads = (leads ?? []).filter(l => l.status === 'new').length;
    const accepted = (leads ?? []).filter(l => l.status === 'accepted').length;
    const converted = (leads ?? []).filter(l => l.status === 'converted').length;
    const totalCompanies = companies?.length ?? 0;
    return { totalLeads, newLeads, accepted, converted, totalCompanies };
  }, [leads, companies]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
    >
      <Text style={styles.h1}>Lead Intelligence Dashboard</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.grid}>
        <StatCard title="Total Leads" value={String(stats.totalLeads)} />
        <StatCard title="New" value={String(stats.newLeads)} />
        <StatCard title="Accepted" value={String(stats.accepted)} />
        <StatCard title="Converted" value={String(stats.converted)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.h2}>Companies</Text>
        <Text style={styles.muted}>Total: {stats.totalCompanies}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    fontSize: 22,
    fontWeight: '700',
  },
  h2: {
    fontSize: 16,
    fontWeight: '700',
  },
  muted: {
    color: '#666',
    marginTop: 4,
  },
  error: {
    color: '#b00020',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  cardTitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
});
