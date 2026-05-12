import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas/cv";

// Register fonts
Font.register({
  family: 'Outfit',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/outfit/v11/QGYsz_MVcBeNP4NJtEtq.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/outfit/v11/QGYsz_MVcBeNP4NJtEtq.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Outfit',
    fontSize: 10,
    color: '#2d3748',
  },
  header: {
    textAlign: 'center',
    marginBottom: 25,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c5282',
    letterSpacing: 1,
  },
  contact: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 15,
    fontSize: 9,
    color: '#718096',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c5282',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 10,
    paddingBottom: 4,
  },
  educationItem: {
    marginBottom: 12,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
    color: '#4a5568',
  },
  bullet: {
    marginLeft: 10,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  }
});

export function GraduateTemplate({ cv }: { cv: CV }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{cv.personal.firstName} {cv.personal.lastName}</Text>
          <View style={styles.contact}>
            <Text>{cv.personal.email}</Text>
            <Text>•</Text>
            <Text>{cv.personal.phone}</Text>
            <Text>•</Text>
            <Text>{cv.personal.address}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {cv.education.map((edu, i) => (
            <View key={i} style={styles.educationItem}>
              <View style={styles.flexRow}>
                <Text style={styles.bold}>{edu.degree}</Text>
                <Text style={styles.bold}>{edu.year}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text>{edu.institution}</Text>
                <Text style={styles.italic}>{edu.grade}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Profile</Text>
          <Text style={{ lineHeight: 1.5 }}>{cv.professionalSummary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Competencies</Text>
          <View style={styles.skillsGrid}>
            {cv.skills.map((skill, i) => (
              <Text key={i}>• {skill}</Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {cv.experience.map((exp, i) => (
            <View key={i} style={{ marginBottom: 15 }}>
              <View style={styles.flexRow}>
                <Text style={styles.bold}>{exp.title}</Text>
                <Text>{exp.startDate} - {exp.endDate}</Text>
              </View>
              <Text style={styles.italic}>{exp.company}</Text>
              <View style={{ marginTop: 5 }}>
                {exp.bullets?.map((bullet, j) => (
                  <Text key={j} style={styles.bullet}>- {bullet}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {cv.projects && cv.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {cv.projects.map((project, i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <View style={styles.flexRow}>
                  <Text style={styles.bold}>{project.name}</Text>
                  {project.link && <Text style={styles.italic}>{project.link}</Text>}
                </View>
                <Text style={{ marginTop: 2, lineHeight: 1.4 }}>{project.description}</Text>
              </View>
            ))}
          </View>
        )}

        {cv.awards && cv.awards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Honors & Awards</Text>
            {cv.awards.map((award, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={styles.flexRow}>
                  <Text style={styles.bold}>{award.name}</Text>
                  <Text>{award.year}</Text>
                </View>
                <Text style={styles.italic}>{award.issuer}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
