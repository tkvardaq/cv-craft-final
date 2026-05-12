import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas/cv";

// Register fonts (standard ones for now)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCOjAkZdqAZAdlVRSjbCqVPqwV0V8scnm6v.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcC7jAkZdqAZAdlVRIyvghjc6L8.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#1a202c',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
    textTransform: 'uppercase',
  },
  contact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    gap: 10,
    color: '#4a5568',
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2b6cb0',
    borderBottom: 1,
    borderBottomColor: '#bee3f8',
    marginBottom: 8,
    paddingBottom: 2,
  },
  summary: {
    lineHeight: 1.5,
  },
  skillGroup: {
    marginBottom: 10,
  },
  skillTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  experienceItem: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  company: {
    fontWeight: 'bold',
  },
  date: {
    color: '#718096',
  },
});

export function FunctionalTemplate({ cv }: { cv: CV }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{cv.personal.firstName} {cv.personal.lastName}</Text>
          <View style={styles.contact}>
            <Text>{cv.personal.email}</Text>
            <Text>{cv.personal.phone}</Text>
            <Text>{cv.personal.address}</Text>
            {cv.personal.linkedin && <Text>{cv.personal.linkedin}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Profile</Text>
          <Text style={styles.summary}>{cv.professionalSummary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Expertise & Skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
            {cv.skills.map((skill, i) => (
              <Text key={i} style={{ backgroundColor: '#f7fafc', padding: '2 5', borderRadius: 3 }}>
                {skill}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Achievements</Text>
          {cv.experience.map((exp, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              {exp.bullets?.map((bullet, j) => (
                <Text key={j} style={{ marginBottom: 3 }}>• {bullet}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment History</Text>
          {cv.experience.map((exp, i) => (
            <View key={i} style={styles.experienceItem}>
              <Text style={styles.company}>{exp.title} | {exp.company}</Text>
              <Text style={styles.date}>{exp.startDate} - {exp.endDate}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {cv.education.map((edu, i) => (
            <View key={i} style={styles.experienceItem}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>{edu.degree}</Text>
                <Text>{edu.institution}</Text>
              </View>
              <Text style={styles.date}>{edu.year}</Text>
            </View>
          ))}
        </View>

        {cv.projects && cv.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Projects</Text>
            {cv.projects.map((project, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.experienceItem}>
                  <Text style={styles.company}>{project.name}</Text>
                  {project.link && <Text style={styles.date}>{project.link}</Text>}
                </View>
                <Text style={styles.summary}>{project.description}</Text>
              </View>
            ))}
          </View>
        )}

        {cv.awards && cv.awards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards & Recognition</Text>
            {cv.awards.map((award, i) => (
              <View key={i} style={styles.experienceItem}>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>{award.name}</Text>
                  <Text>{award.issuer}</Text>
                </View>
                <Text style={styles.date}>{award.year}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
