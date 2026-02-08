import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api } from '../api/client';
import type { Lead } from '../api/types';
import type { LeadsStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<LeadsStackParamList, 'LeadDetail'>;

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{String(value)}</Text>
    </View>
  );
}

export default function LeadDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        const l = await api.getLeadById(id);
        setLead(l);
        navigation.setOptions({ title: l.lead_id || 'Lead Detail' });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!lead) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Lead not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.h1}>{lead.Title || lead.Full_Reference || lead.lead_id || lead._id}</Text>
      <Text style={styles.sub}>{lead.Company_Name || lead.Company_Canonical || '—'}</Text>

      <View style={styles.card}>
        <Field label="Status" value={lead.status} />
        <Field label="Urgency" value={lead.urgency} />
        <Field label="Confidence" value={lead.confidence_score} />
        <Field label="Captured At" value={lead.Captured_At} />
        <Field label="Opening Date" value={lead.Opening_Date} />
        <Field label="Closing Date" value={lead.Closing_Date} />
        <Field label="Products" value={lead.HPCL_Products} />
        <Field label="Signal Type" value={lead.Signal_Type} />
        <Field label="Source" value={lead.Source} />
        <Field label="Provenance" value={lead.Provenance} />
        <Field label="Summary" value={lead.Summary} />
        <Field label="Description" value={lead.Combined_Text} />
      </View>

      {lead.URL ? (
        <Text style={styles.link} onPress={() => Linking.openURL(lead.URL as string)}>
          Open Source URL
        </Text>
      ) : null}
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
    padding: 16,
  },
  h1: {
    fontSize: 18,
    fontWeight: '800',
  },
  sub: {
    marginTop: 4,
    color: '#444',
  },
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  field: {
    marginBottom: 10,
  },
  label: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
    color: '#111',
  },
  link: {
    color: '#0b5fff',
    fontWeight: '700',
  },
  error: {
    color: '#b00020',
  },
});
