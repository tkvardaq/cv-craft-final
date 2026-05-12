import {
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas/cv";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    borderBottom: "1 solid #000",
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    fontSize: 9,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 15,
    marginBottom: 8,
    borderBottom: "0.5 solid #666",
    paddingBottom: 2,
    textTransform: "uppercase",
  },
  summary: {
    lineHeight: 1.4,
    marginBottom: 10,
  },
  expEntry: {
    marginBottom: 12,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  expTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  expCompany: {
    fontFamily: "Helvetica-Bold",
  },
  date: {
    fontSize: 9,
    color: "#333",
  },
  bullet: {
    paddingLeft: 15,
    marginBottom: 2,
    fontSize: 9,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});

export function ProfessionalTemplate({ cv }: { cv: CV }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{cv.personal.firstName} {cv.personal.lastName}</Text>
        <View style={styles.contactRow}>
          <Text>{cv.personal.email}</Text>
          <Text>{cv.personal.phone}</Text>
          <Text>{cv.personal.address}</Text>
        </View>
      </View>

      {cv.professionalSummary && (
        <View>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{cv.professionalSummary}</Text>
        </View>
      )}

      {cv.experience.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {cv.experience.map((exp) => (
            <View key={exp.id} style={styles.expEntry}>
              <View style={styles.expHeader}>
                <Text style={styles.expTitle}>{exp.title}</Text>
                <Text style={styles.date}>{exp.startDate} – {exp.endDate}</Text>
              </View>
              <Text style={styles.expCompany}>{exp.company}</Text>
              {exp.bullets.map((bullet, i) => (
                <Text key={i} style={styles.bullet}>• {bullet}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {cv.education.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {cv.education.map((edu) => (
            <View key={edu.id} style={styles.expEntry}>
              <View style={styles.expHeader}>
                <Text style={styles.expCompany}>{edu.institution}</Text>
                <Text style={styles.date}>{edu.year}</Text>
              </View>
              <Text>{edu.degree} {edu.grade ? `(${edu.grade})` : ""}</Text>
            </View>
          ))}
        </View>
      )}

      {cv.projects.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Key Projects</Text>
          {cv.projects.map((proj) => (
            <View key={proj.id} style={styles.expEntry}>
              <View style={styles.expHeader}>
                <Text style={styles.expTitle}>{proj.name}</Text>
                {proj.link && <Text style={styles.date}>{proj.link}</Text>}
              </View>
              <Text style={styles.summary}>{proj.description}</Text>
            </View>
          ))}
        </View>
      )}

      {cv.awards.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Awards & Recognition</Text>
          {cv.awards.map((award) => (
            <View key={award.id} style={styles.expEntry}>
              <View style={styles.expHeader}>
                <Text style={styles.expTitle}>{award.name}</Text>
                <Text style={styles.date}>{award.year}</Text>
              </View>
              <Text>{award.issuer}</Text>
            </View>
          ))}
        </View>
      )}

      {cv.skills.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          <View style={styles.skillsGrid}>
            {cv.skills.map((skill, i) => (
              <Text key={i}>• {skill}</Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  );
}
