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
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#000",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  contact: {
    fontSize: 9,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    borderBottom: "1 solid #000",
    marginTop: 15,
    marginBottom: 8,
    paddingBottom: 2,
  },
  entry: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "Times-Bold",
    marginBottom: 2,
  },
  institution: {
    fontFamily: "Times-Bold",
  },
  summary: {
    lineHeight: 1.3,
    marginBottom: 10,
    textAlign: "justify",
  },
  bullet: {
    marginLeft: 15,
    marginBottom: 2,
    lineHeight: 1.3,
  }
});

export function AcademicTemplate({ cv }: { cv: CV }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{cv.personal.firstName} {cv.personal.lastName}</Text>
        <Text style={styles.contact}>{cv.personal.address}</Text>
        <Text style={styles.contact}>{cv.personal.email} | {cv.personal.phone}</Text>
      </View>

      {cv.professionalSummary && (
        <View>
          <Text style={styles.sectionTitle}>Research Profile</Text>
          <Text style={styles.summary}>{cv.professionalSummary}</Text>
        </View>
      )}

      {cv.education.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {cv.education.map((edu) => (
            <View key={edu.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text>{edu.institution}</Text>
                <Text>{edu.year}</Text>
              </View>
              <Text style={{ fontStyle: "italic" }}>{edu.degree} {edu.grade ? `— ${edu.grade}` : ""}</Text>
            </View>
          ))}
        </View>
      )}

      {cv.experience.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Professional Appointments</Text>
          {cv.experience.map((exp) => (
            <View key={exp.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text>{exp.company}</Text>
                <Text>{exp.startDate} – {exp.endDate}</Text>
              </View>
              <Text style={{ fontFamily: "Times-Bold", fontSize: 9 }}>{exp.title}</Text>
              {exp.bullets.map((bullet, i) => (
                <Text key={i} style={styles.bullet}>• {bullet}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {cv.skills.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Areas of Expertise</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
            {cv.skills.map((skill, i) => (
              <Text key={i}>{skill}{i < cv.skills.length - 1 ? "," : ""}</Text>
            ))}
          </View>
        </View>
      )}
      {cv.projects && cv.projects.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Research & Projects</Text>
          {cv.projects.map((project, i) => (
            <View key={i} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.institution}>{project.name}</Text>
                {project.link && <Text style={{ fontSize: 8 }}>{project.link}</Text>}
              </View>
              <Text style={styles.summary}>{project.description}</Text>
            </View>
          ))}
        </View>
      )}

      {cv.awards && cv.awards.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Honors & Awards</Text>
          {cv.awards.map((award, i) => (
            <View key={i} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.institution}>{award.name}</Text>
                <Text>{award.year}</Text>
              </View>
              <Text>{award.issuer}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  );
}
