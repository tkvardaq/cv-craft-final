import {
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas/cv";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#333",
  },
  sidebar: {
    width: "30%",
    backgroundColor: "#1e1b4b",
    color: "#ffffff",
    padding: 30,
    height: "100%",
  },
  main: {
    width: "70%",
    padding: 30,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: "#ffffff",
  },
  title: {
    fontSize: 10,
    marginBottom: 20,
    color: "#a5b4fc",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionTitleSide: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginTop: 20,
    marginBottom: 10,
    textTransform: "uppercase",
    borderBottom: "1 solid #4338ca",
    paddingBottom: 4,
  },
  sectionTitleMain: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1e1b4b",
    marginTop: 20,
    marginBottom: 10,
    textTransform: "uppercase",
    borderBottom: "2 solid #e5e7eb",
    paddingBottom: 4,
  },
  contactItem: {
    marginBottom: 8,
    fontSize: 9,
  },
  skillTag: {
    marginBottom: 4,
    fontSize: 9,
    color: "#e0e7ff",
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.6,
    marginBottom: 15,
  },
  expEntry: {
    marginBottom: 15,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  expTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  expDate: {
    fontSize: 9,
    color: "#6b7280",
  },
  expCompany: {
    fontSize: 10,
    color: "#4b5563",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 9,
    paddingLeft: 10,
    marginBottom: 2,
  },
});

export function ModernTemplate({ cv }: { cv: CV }) {
  return (
    <Page size="A4" style={styles.page}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <Text style={styles.name}>{cv.personal.firstName}</Text>
        <Text style={[styles.name, { marginTop: -4 }]}>{cv.personal.lastName}</Text>
        <Text style={styles.title}>{cv.experience[0]?.title || "Professional"}</Text>

        <Text style={styles.sectionTitleSide}>Contact</Text>
        <Text style={styles.contactItem}>{cv.personal.email}</Text>
        <Text style={styles.contactItem}>{cv.personal.phone}</Text>
        <Text style={styles.contactItem}>{cv.personal.address}</Text>

        {cv.skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitleSide}>Skills</Text>
            {cv.skills.map((skill, i) => (
              <Text key={i} style={styles.skillTag}>• {skill}</Text>
            ))}
          </View>
        )}

        {cv.languages.length > 0 && (
          <View>
            <Text style={styles.sectionTitleSide}>Languages</Text>
            {cv.languages.map((lang, i) => (
              <Text key={i} style={styles.skillTag}>• {lang}</Text>
            ))}
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        {cv.professionalSummary && (
          <View>
            <Text style={styles.sectionTitleMain}>About Me</Text>
            <Text style={styles.summary}>{cv.professionalSummary}</Text>
          </View>
        )}

        {cv.experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitleMain}>Experience</Text>
            {cv.experience.map((exp) => (
              <View key={exp.id} style={styles.expEntry}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                  <Text style={styles.expDate}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                <Text style={styles.expCompany}>{exp.company}</Text>
                {exp.bullets.map((bullet, i) => (
                  <Text key={i} style={styles.bullet}>• {bullet}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {cv.projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitleMain}>Projects</Text>
            {cv.projects.map((proj) => (
              <View key={proj.id} style={styles.expEntry}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{proj.name}</Text>
                  {proj.link && <Text style={styles.expDate}>{proj.link}</Text>}
                </View>
                <Text style={styles.summary}>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {cv.awards.length > 0 && (
          <View>
            <Text style={styles.sectionTitleMain}>Awards & Honors</Text>
            {cv.awards.map((award) => (
              <View key={award.id} style={styles.expEntry}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{award.name}</Text>
                  <Text style={styles.expDate}>{award.year}</Text>
                </View>
                <Text style={styles.expCompany}>{award.issuer}</Text>
              </View>
            ))}
          </View>
        )}

        {cv.education.length > 0 && (
          <View>
            <Text style={styles.sectionTitleMain}>Education</Text>
            {cv.education.map((edu) => (
              <View key={edu.id} style={styles.expEntry}>
                <View style={styles.expHeader}>
                  <Text style={styles.expTitle}>{edu.degree}</Text>
                  <Text style={styles.expDate}>{edu.year}</Text>
                </View>
                <Text style={styles.expCompany}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  );
}
