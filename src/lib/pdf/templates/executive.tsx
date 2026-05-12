import {
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
    fontSize: 9,
    color: "#2d3436",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2 solid #8b6e3d",
    paddingBottom: 20,
  },
  name: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 5,
    letterSpacing: 2,
  },
  title: {
    fontSize: 14,
    color: "#8b6e3d",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    gap: 20,
    fontSize: 8,
    color: "#636e72",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#8b6e3d",
    textTransform: "uppercase",
    borderBottom: "1 solid #dfe6e9",
    paddingBottom: 4,
    marginBottom: 10,
  },
  entry: {
    marginBottom: 15,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#1a1a1a",
  },
  italic: {
    fontStyle: "italic",
    color: "#636e72",
  },
  date: {
    fontSize: 8,
    color: "#8b6e3d",
    fontFamily: "Helvetica-Bold",
  },
  bullet: {
    marginLeft: 10,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillTag: {
    backgroundColor: "#f1f2f6",
    padding: "3 8",
    borderRadius: 4,
    color: "#2d3436",
  }
});

export function ExecutiveTemplate({ cv }: { cv: CV }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{cv.personal.firstName} {cv.personal.lastName}</Text>
        <Text style={styles.title}>{cv.experience[0]?.title || "Senior Professional"}</Text>
        <View style={styles.contactRow}>
          <Text>{cv.personal.email}</Text>
          <Text>{cv.personal.phone}</Text>
          <Text>{cv.personal.address}</Text>
        </View>
      </View>

      {cv.professionalSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Profile</Text>
          <Text style={{ lineHeight: 1.5 }}>{cv.professionalSummary}</Text>
        </View>
      )}

      {cv.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Accomplishments</Text>
          {cv.experience.map((exp) => (
            <View key={exp.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.bold}>{exp.title}</Text>
                <Text style={styles.date}>{exp.startDate} – {exp.endDate}</Text>
              </View>
              <Text style={[styles.italic, { marginBottom: 5 }]}>{exp.company}</Text>
              {exp.bullets.map((bullet, i) => (
                <Text key={i} style={styles.bullet}>• {bullet}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {cv.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Strategic Projects</Text>
          {cv.projects.map((proj) => (
            <View key={proj.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.bold}>{proj.name}</Text>
                {proj.link && <Text style={styles.date}>{proj.link}</Text>}
              </View>
              <Text style={{ lineHeight: 1.4 }}>{proj.description}</Text>
            </View>
          ))}
        </View>
      )}

      {cv.awards.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Honors & Awards</Text>
          {cv.awards.map((award) => (
            <View key={award.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.bold}>{award.name}</Text>
                <Text style={styles.date}>{award.year}</Text>
              </View>
              <Text style={styles.italic}>{award.issuer}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ flexDirection: "row", gap: 30 }}>
        <View style={{ flex: 1 }}>
          {cv.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Academic Background</Text>
              {cv.education.map((edu) => (
                <View key={edu.id} style={styles.entry}>
                  <Text style={styles.bold}>{edu.institution}</Text>
                  <Text>{edu.degree}</Text>
                  <Text style={styles.date}>{edu.year}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {cv.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Strategic Expertise</Text>
              <View style={styles.skillsContainer}>
                {cv.skills.map((skill, i) => (
                  <View key={i} style={styles.skillTag}>
                    <Text>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </Page>
  );
}
