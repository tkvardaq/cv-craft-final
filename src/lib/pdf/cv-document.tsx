"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas/cv";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 16,
    borderBottom: "2 solid #4338ca",
    paddingBottom: 12,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1e1b4b",
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    fontSize: 9,
    color: "#4b5563",
  },
  contactItem: {
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#4338ca",
    marginTop: 14,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1 solid #e5e7eb",
    paddingBottom: 3,
  },
  summary: {
    fontSize: 10,
    color: "#374151",
    marginBottom: 8,
    lineHeight: 1.6,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  skillTag: {
    backgroundColor: "#eef2ff",
    color: "#4338ca",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 9,
  },
  expEntry: {
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  expTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
  },
  expDate: {
    fontSize: 9,
    color: "#6b7280",
  },
  expCompany: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 9.5,
    color: "#374151",
    paddingLeft: 12,
    marginBottom: 2,
    lineHeight: 1.5,
  },
  eduEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  eduDegree: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
  },
  eduInstitution: {
    fontSize: 9.5,
    color: "#4b5563",
  },
  eduYear: {
    fontSize: 9,
    color: "#6b7280",
  },
  certItem: {
    fontSize: 9.5,
    color: "#374151",
    marginBottom: 2,
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "15%",
    fontSize: 48,
    color: "#e5e7eb",
    opacity: 0.3,
    transform: "rotate(-35deg)",
    fontFamily: "Helvetica-Bold",
  },
  badge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#059669",
    color: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
});

interface CVDocumentProps {
  cv: CV;
  isPremium?: boolean;
}

export function CVDocument({ cv, isPremium = false }: CVDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark for free users */}
        {!isPremium && <Text style={styles.watermark}>CVCraft.uk</Text>}

        {/* ATS-Ready badge for premium */}
        {isPremium && <Text style={styles.badge}>✓ ATS-Ready</Text>}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {cv.personal.firstName} {cv.personal.lastName}
          </Text>
          <View style={styles.contactRow}>
            {cv.personal.email && (
              <Text style={styles.contactItem}>{cv.personal.email}</Text>
            )}
            {cv.personal.phone && (
              <Text style={styles.contactItem}>{cv.personal.phone}</Text>
            )}
            {cv.personal.address && (
              <Text style={styles.contactItem}>{cv.personal.address}</Text>
            )}
            {cv.personal.linkedin && (
              <Text style={styles.contactItem}>{cv.personal.linkedin}</Text>
            )}
          </View>
        </View>

        {/* Skills (placed early for agency ATS compliance) */}
        {cv.skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Key Skills</Text>
            <View style={styles.skillsRow}>
              {cv.skills.map((skill, i) => (
                <Text key={i} style={styles.skillTag}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Professional Summary */}
        {cv.professionalSummary && (
          <View>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{cv.professionalSummary}</Text>
          </View>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {cv.experience.map((exp) => (
              <View key={exp.id} style={styles.expEntry}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                  <Text style={styles.expDate}>
                    {exp.startDate} – {exp.endDate}
                  </Text>
                </View>
                <Text style={styles.expCompany}>
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
                </Text>
                {exp.bullets.map((bullet, i) => (
                  <Text key={i} style={styles.bullet}>
                    • {bullet}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {cv.education.map((edu) => (
              <View key={edu.id} style={styles.eduEntry}>
                <View>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  <Text style={styles.eduInstitution}>
                    {edu.institution}
                    {edu.grade ? ` — ${edu.grade}` : ""}
                  </Text>
                </View>
                <Text style={styles.eduYear}>{edu.year}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {cv.certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {cv.certifications.map((cert, i) => (
              <Text key={i} style={styles.certItem}>
                • {cert}
              </Text>
            ))}
          </View>
        )}

        {/* Languages */}
        {cv.languages.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={styles.certItem}>{cv.languages.join(" • ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
