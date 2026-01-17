import React, { useState } from 'react'
import { useUserContext } from '@/context/user-context'
import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import {
  Mail,
  Building2,
  Calendar,
  Shield,
  User,
  Lock,
  AlertCircle,
  Check,
  X,
} from 'lucide-react'

const AccountDetails: React.FC = () => {
  const { user } = useUserContext()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const breadcrumbs: Breadcrumbs[] = [{ title: 'Account', href: '#' }]

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('Passwords do not match')
      return
    }

    if (passwordForm.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: API call here
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPasswordSuccess('Password updated successfully')
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
      setTimeout(() => {
        setIsChangingPassword(false)
        setPasswordSuccess('')
      }, 2000)
    } catch (err) {
      setPasswordError('Failed to update password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status?: number) => {
    if (status === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded">
          <div className="w-1 h-1 rounded-full bg-emerald-600" />
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-600 bg-slate-100 rounded">
        <div className="w-1 h-1 rounded-full bg-slate-400" />
        Inactive
      </span>
    )
  }

  const getVerificationBadge = (verified?: string) => {
    if (verified) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded">
          <Check className="w-3 h-3" />
          Verified
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-50 rounded">
        <AlertCircle className="w-3 h-3" />
        Unverified
      </span>
    )
  }

  if (!user) {
    return (
      <>
        <Header breadcrumbs={breadcrumbs} />
        <MainContainer>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600">Unable to load account</p>
            </div>
          </div>
        </MainContainer>
      </>
    )
  }

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="mb-12">
            <div className="flex items-start gap-6">
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-semibold text-white">
                    {user.first_name.charAt(0)}
                    {user.last_name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {user.first_name} {user.last_name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-sm text-slate-600 capitalize">
                    {user.role}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm text-slate-600">{user.office}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(user.status)}
                  {getVerificationBadge(user.email_verified_at)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Personal Information */}
            <section>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Personal Information
              </h2>
              <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Full Name
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium">
                    {user.first_name} {user.last_name}
                  </span>
                </div>

                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Email Address
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium">
                    {user.email || '—'}
                  </span>
                </div>

                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Office Location
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium">
                    {user.office}
                  </span>
                </div>

                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Account Role
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium capitalize">
                    {user.role}
                  </span>
                </div>

                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Member Since
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium">
                    {formatDate(user.created_at)}
                  </span>
                </div>
              </div>
            </section>

            {/* Security */}
            <section>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Security
              </h2>
              <div className="bg-white border border-slate-200 rounded-lg">
                {!isChangingPassword ? (
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Password
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Last updated {formatDate(user.updated_at)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="p-6">
                    {passwordError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{passwordError}</p>
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-emerald-700">
                          {passwordSuccess}
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.current_password}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              current_password: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.new_password}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              new_password: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-slate-500 mt-1.5">
                          Must be at least 8 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirm_password}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirm_password: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPassword(false)
                          setPasswordForm({
                            current_password: '',
                            new_password: '',
                            confirm_password: '',
                          })
                          setPasswordError('')
                          setPasswordSuccess('')
                        }}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>
          </div>
        </div>
      </MainContainer>
    </>
  )
}

export default AccountDetails
