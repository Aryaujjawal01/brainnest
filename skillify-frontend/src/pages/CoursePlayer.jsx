import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { FiCheckCircle, FiCircle, FiPlayCircle, FiChevronLeft, FiMenu, FiX, FiAward, FiDownload, FiEdit3, FiBookmark } from 'react-icons/fi'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'

export default function CoursePlayer() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completedLessons, setCompletedLessons] = useState([])
  const [bookmarkedLessons, setBookmarkedLessons] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useAuth()
  const [downloadingCert, setDownloadingCert] = useState(false)
  
  // Notes state
  const [noteContent, setNoteContent] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  
  // Quiz state
  const [quiz, setQuiz] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, progressRes, quizRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/enrollments/progress/${courseId}`),
          api.get(`/quizzes/${courseId}`).catch(() => ({ data: null }))
        ])
        
        setCourse(courseRes.data)
        setCompletedLessons(progressRes.data.completedLessons || [])
        setBookmarkedLessons(progressRes.data.bookmarkedLessons || [])
        setQuiz(quizRes.data)
        
        if (courseRes.data.curriculum?.length > 0) {
          const firstUncompleted = courseRes.data.curriculum.find(
            l => !progressRes.data.completedLessons?.includes(l._id)
          )
          setActiveLesson(firstUncompleted || courseRes.data.curriculum[0])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [courseId])

  useEffect(() => {
    if (activeLesson) {
      api.get(`/notes/${courseId}/${activeLesson._id}`)
        .then(res => setNoteContent(res.data.content || ''))
        .catch(() => setNoteContent(''))
    }
  }, [activeLesson, courseId])

  const markComplete = async (lessonId) => {
    if (completedLessons.includes(lessonId)) return
    
    try {
      await api.put(`/enrollments/progress/${courseId}`, { lessonId })
      setCompletedLessons([...completedLessons, lessonId])
    } catch (err) {
      console.error(err)
    }
  }

  const toggleBookmark = async (e, lessonId) => {
    e.stopPropagation()
    try {
      const { data } = await api.put(`/enrollments/bookmark/${courseId}`, { lessonId })
      setBookmarkedLessons(data)
      toast.success(data.includes(lessonId) ? 'Lesson Bookmarked' : 'Bookmark removed')
    } catch (err) {
      toast.error('Failed to update bookmark')
    }
  }

  const handleSaveNote = async () => {
    if (!activeLesson) return
    setSavingNote(true)
    try {
      await api.post('/notes', { courseId, lessonId: activeLesson._id, content: noteContent })
      toast.success('Notes saved')
    } catch (err) {
      toast.error('Failed to save notes')
    } finally {
      setSavingNote(false)
    }
  }

  const downloadNotes = () => {
    const element = document.createElement("a");
    const file = new Blob([noteContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${activeLesson?.title || 'Lesson'}_Notes.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  }

  const submitQuiz = async () => {
    try {
      const { data } = await api.post(`/quizzes/${courseId}/submit`, { answers: quizAnswers })
      setQuizResult(data)
      toast.success(data.passed ? 'Quiz Passed!' : 'Quiz Failed, try again.')
    } catch (err) {
      toast.error('Failed to submit quiz')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
    </div>
  )
  if (!course) return <p className="text-center py-16">Course not found.</p>

  const isCompleted = (id) => completedLessons.includes(id)
  const progress = Math.round((completedLessons.length / (course.curriculum?.length || 1)) * 100)

  const downloadCertificate = async () => {
    setDownloadingCert(true)
    const certElement = document.getElementById('certificate-template')
    certElement.style.display = 'block'
    
    try {
      const canvas = await html2canvas(certElement, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('landscape', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${course.title.replace(/\s+/g, '_')}_Certificate.pdf`)
    } catch (err) {
      console.error('Error generating certificate', err)
    } finally {
      certElement.style.display = 'none'
      setDownloadingCert(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-dark-bg overflow-hidden transition-colors duration-300">
      {/* Top Navbar specifically for player */}
      <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/student" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
            <FiChevronLeft className="w-6 h-6" />
          </Link>
          <div className="hidden sm:block border-l border-gray-300 dark:border-gray-700 h-8 mx-2"></div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md md:max-w-xl">{course.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{progress}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {progress === 100 && (
            <button
              onClick={downloadCertificate}
              disabled={downloadingCert}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <FiAward className="w-4 h-4" />
              {downloadingCert ? 'Generating...' : 'Get Certificate'}
            </button>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar relative z-0">
          <div className="bg-black w-full relative">
            {/* 16:9 Aspect ratio container */}
            <div className="pt-[56.25%] relative">
              {activeLesson ? (
                <video
                  key={activeLesson._id}
                  src={activeLesson.videoUrl}
                  controls
                  controlsList="nodownload"
                  autoPlay
                  className="absolute top-0 left-0 w-full h-full"
                  onEnded={() => markComplete(activeLesson._id)}
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <FiPlayCircle className="w-16 h-16 mb-4 opacity-50" />
                  <p>Select a lesson from the curriculum to start</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 max-w-4xl mx-auto w-full">
            {activeLesson ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeLesson.title}</h2>
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => toggleBookmark(e, activeLesson._id)}
                      className={`flex items-center justify-center p-2 rounded-full transition-colors ${
                        bookmarkedLessons.includes(activeLesson._id) 
                          ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' 
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:text-indigo-500'
                      }`}
                      title="Bookmark this lesson"
                    >
                      <FiBookmark className={bookmarkedLessons.includes(activeLesson._id) ? 'fill-current' : ''} />
                    </button>
                    <button 
                      onClick={() => markComplete(activeLesson._id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        isCompleted(activeLesson._id) 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {isCompleted(activeLesson._id) ? (
                        <><FiCheckCircle className="w-4 h-4" /> Completed</>
                      ) : (
                        <><FiCircle className="w-4 h-4" /> Mark as complete</>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Notes Section */}
                <div className="mt-8 bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                      <FiEdit3 className="text-indigo-500" /> My Notes
                    </h3>
                    <div className="flex gap-2">
                      <button onClick={downloadNotes} className="text-sm font-medium text-gray-500 hover:text-indigo-500 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                        <FiDownload /> Export
                      </button>
                      <button onClick={handleSaveNote} disabled={savingNote} className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg disabled:opacity-50">
                        {savingNote ? 'Saving...' : 'Save Notes'}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Take notes while you watch... (Markdown supported mentally)"
                    className="w-full h-32 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-y"
                  ></textarea>
                </div>

                {activeLesson.description && (
                  <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lesson Description</h3>
                    <p>{activeLesson.description}</p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* Sidebar Curriculum */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 absolute lg:relative right-0 top-0 bottom-0 w-80 lg:w-96 bg-white dark:bg-dark-card border-l border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out flex flex-col z-20 shadow-xl lg:shadow-none`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-dark-bg/50">
            <h2 className="font-bold text-gray-900 dark:text-white">Course Content</h2>
            <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {course.curriculum?.map((lesson, idx) => {
              const active = activeLesson?._id === lesson._id;
              const completed = isCompleted(lesson._id);
              const bookmarked = bookmarkedLessons.includes(lesson._id);
              
              return (
                <button
                  key={lesson._id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left p-3 rounded-xl mb-1 flex items-start gap-3 transition-colors ${
                    active 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
                  }`}
                >
                  <div className="mt-0.5">
                    {completed ? (
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                    ) : active ? (
                      <FiPlayCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 pr-2">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium leading-snug ${
                        active ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {lesson.title}
                      </p>
                      {bookmarked && <FiBookmark className="w-3 h-3 text-indigo-500 fill-current ml-2 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                      <FiPlayCircle /> Video • {lesson.duration || '00:00'}
                    </p>
                  </div>
                </button>
              )
            })}

            {quiz && (
              <button
                onClick={() => setShowQuiz(true)}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-xl font-bold flex items-center justify-between shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2"><FiAward className="w-5 h-5" /> Final Assessment</div>
                <FiPlayCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && quiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white dark:bg-dark-card w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold dark:text-white">{quiz.title}</h2>
                <p className="text-gray-500 text-sm mt-1">{quiz.description}</p>
              </div>
              <button onClick={() => {setShowQuiz(false); setQuizResult(null); setQuizAnswers({})}} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-8">
              {quizResult ? (
                <div className="text-center py-10">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 border-4 ${quizResult.passed ? 'bg-green-100 border-green-500 text-green-600' : 'bg-red-100 border-red-500 text-red-600'}`}>
                    <FiAward className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold dark:text-white mb-2">{quizResult.passed ? 'Congratulations!' : 'Keep Trying!'}</h3>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">You scored {quizResult.percentage}% ({quizResult.score}/{quizResult.total})</p>
                  <button onClick={() => {setQuizResult(null); setQuizAnswers({})}} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-md">
                    {quizResult.passed ? 'Review Questions' : 'Retake Quiz'}
                  </button>
                </div>
              ) : (
                quiz.questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-gray-50 dark:bg-dark-bg p-5 rounded-xl border border-gray-200 dark:border-gray-800">
                    <p className="font-bold text-lg dark:text-white mb-4">{qIndex + 1}. {q.questionText}</p>
                    <div className="space-y-3">
                      {q.options.map((opt, oIndex) => (
                        <label key={oIndex} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          quizAnswers[qIndex] === oIndex 
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                            : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}>
                          <input 
                            type="radio" 
                            name={`question-${qIndex}`} 
                            checked={quizAnswers[qIndex] === oIndex}
                            onChange={() => setQuizAnswers(prev => ({...prev, [qIndex]: oIndex}))}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {!quizResult && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                <button 
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length !== quiz.questions.length}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-colors"
                >
                  Submit Answers
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden Certificate Template for PDF generation */}
      <div 
        id="certificate-template" 
        style={{ display: 'none', width: '297mm', height: '210mm' }} 
        className="bg-white p-20 relative text-center border-8 border-double border-amber-600 z-[-1]"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 z-[-1]"></div>
        <h1 className="text-6xl font-serif font-bold text-gray-900 mt-10 mb-6 uppercase tracking-widest text-amber-700">Certificate of Completion</h1>
        <p className="text-2xl text-gray-600 italic mb-10">This is to certify that</p>
        <h2 className="text-5xl font-bold text-indigo-900 mb-10 border-b-2 border-amber-300 inline-block pb-4 px-10">{user?.name || 'Student Name'}</h2>
        <p className="text-2xl text-gray-600 mb-6">has successfully completed the course</p>
        <h3 className="text-4xl font-bold text-gray-800 mb-16">{course.title}</h3>
        <div className="flex justify-between items-end px-20 mt-20">
          <div className="text-center">
            <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
            <p className="text-gray-600 font-bold">BrainNest Pro</p>
          </div>
          <div className="w-32 h-32 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-4 border-amber-200">
            <span className="text-white font-bold text-xl text-center leading-tight">Official<br/>Certified</span>
          </div>
          <div className="text-center">
            <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
            <p className="text-gray-600 font-bold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
