import {
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas/cv";

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#000",
    lineHeight: 1.6,
  },
  name: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  contact: {
    fontSize: 8,
    color: "#666",
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  entry: {
    marginBottom: 15,
  },
  title: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 9,
    color: "#333",
  },
  date: {
    fontSize: 8,
    color: "#999",
  },
  content: {
    marginTop: 4,
  },
});

export function MinimalistTemplate({ cv, isPremium = false }: { cv: CV; isPremium?: boolean }) {
  return (
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.name}>{cv.personal.firstName} {cv.personal.lastName}</Text>
        <Text style={styles.contact}>
          {cv.personal.email}  /  {cv.personal.phone}  /  {cv.personal.address}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <Text>{cv.professionalSummary}</Text>
      </View>

      {cv.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {cv.experience.map((exp) => (
            <View key={exp.id} style={styles.entry}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.title}>{exp.title}</Text>
                <Text style={styles.date}>{exp.startDate} – {exp.endDate}</Text>
              </View>
              <Text style={styles.subtitle}>{exp.company}</Text>
              <View style={styles.content}>
                {exp.bullets.map((bullet, i) => (
                  <Text key={i}>• {bullet}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {cv.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {cv.education.map((edu) => (
            <View key={edu.id} style={styles.entry}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.title}>{edu.degree}</Text>
                <Text style={styles.date}>{edu.year}</Text>
              </View>
              <Text style={styles.subtitle}>{edu.institution}</Text>
            </View>
          ))}
        </View>
      )}

      {cv.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {cv.projects.map((proj) => (
            <View key={proj.id} style={styles.entry}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.title}>{proj.name}</Text>
                {proj.link && <Text style={styles.date}>{proj.link}</Text>}
              </View>
              <Text style={styles.content}>{proj.description}</Text>
            </View>
          ))}
        </View>
      )}

      {cv.awards.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Awards</Text>
          {cv.awards.map((award) => (
            <View key={award.id} style={styles.entry}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.title}>{award.name}</Text>
                <Text style={styles.date}>{award.year}</Text>
              </View>
              <Text style={styles.subtitle}>{award.issuer}</Text>
            </View>
          ))}
        </View>
      )}

      {cv.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text>{cv.skills.join(" · ")}</Text>
        </View>
      )}
    
      {!isPremium && <Text style={{ position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center", fontSize: 8, color: "#9ca3af" }}>Created with CvCRAFT.uk</Text>}
    </Page>
  );
}
