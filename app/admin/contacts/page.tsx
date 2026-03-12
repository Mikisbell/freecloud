'use client'

import { useState, useEffect, useMemo } from 'react'
import { getContacts, markContactAsRead, deleteContact, Contact } from '@/lib/supabase'
import { CheckCircle, Clock, Mail, MessageSquare, X, ChevronLeft, Search, Trash2, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchContacts = async () => {
        setLoading(true)
        try {
            const data = await getContacts()
            setContacts(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContacts()
    }, [])

    const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation()
        try {
            setContacts(prev => prev.map(c => c.id === id ? { ...c, read: true } : c))
            if (selectedContact?.id === id) {
                setSelectedContact(prev => prev ? { ...prev, read: true } : null)
            }
            await markContactAsRead(id)
        } catch (error) {
            console.error('Error marking as read', error)
            fetchContacts()
        }
    }

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation()
        if (!confirm('¿Eliminar este mensaje permanentemente?')) return
        try {
            setContacts(prev => prev.filter(c => c.id !== id))
            if (selectedContact?.id === id) setSelectedContact(null)
            await deleteContact(id)
        } catch (error) {
            console.error('Error deleting contact', error)
            fetchContacts()
        }
    }

    const handleSelectContact = (contact: Contact) => {
        setSelectedContact(contact)
        if (!contact.read) {
            handleMarkAsRead(contact.id)
        }
    }

    const filteredContacts = useMemo(() =>
        contacts.filter(c => {
            if (!searchTerm) return true
            const q = searchTerm.toLowerCase()
            return c.name.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                c.message.toLowerCase().includes(q)
        }), [contacts, searchTerm])

    const unreadCount = contacts.filter(c => !c.read).length

    const handleExportCSV = () => {
        const header = 'Nombre,Email,Servicio,Mensaje,Fecha,Estado\n'
        const rows = filteredContacts.map(c => {
            const date = new Date(c.created_at!).toLocaleString('es-PE')
            const status = c.read ? 'Leído' : 'No leido'
            // Sanitizar campos CSV: escapar comillas dobles y cambiar newlines por espacios
            const msg = c.message.replace(/"/g, '""').replace(/\n/g, ' ')
            const service = c.service ? c.service.replace(/"/g, '""') : ''
            return `"${c.name}","${c.email}","${service}","${msg}","${date}","${status}"`
        }).join('\n')
        
        // Incluir BOM para que Excel detecte UTF-8 correctamente
        const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `contactos-freecloud-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-4 sm:space-y-6 animate-fade-in max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold font-grotesk text-white flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <MessageSquare className="text-amber-400 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        Bandeja de Contactos
                    </h1>
                    <p className="text-xs sm:text-sm text-white/40 mt-1 ml-[42px] sm:ml-[46px]">Mensajes desde la página web</p>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto w-full sm:w-auto mt-2 sm:mt-0">
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="bg-fc-blue/10 text-fc-cyan border-0 text-xs">
                            {unreadCount} no leídos
                        </Badge>
                    )}
                    <Button 
                        onClick={handleExportCSV} 
                        disabled={filteredContacts.length === 0} 
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 ml-auto"
                        size="sm"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-7 w-7 border-2 border-fc-blue border-t-transparent" />
                </div>
            ) : contacts.length === 0 ? (
                <Card className="bg-white/[0.02] border-white/[0.06]">
                    <CardContent className="p-8 sm:p-12 text-center flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-white/20" />
                        </div>
                        <h3 className="text-base font-semibold text-white mb-1">Bandeja Vacía</h3>
                        <p className="text-sm text-white/30">Aún no has recibido ningún mensaje de contacto.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-white/25 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                            type="text"
                            placeholder="Buscar por nombre, email o mensaje..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/25 h-10 text-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {filteredContacts.length === 0 ? (
                        <p className="text-sm text-white/30 text-center py-8">No se encontraron mensajes con esa búsqueda.</p>
                    ) : (
                        <>
                            {/* === MOBILE: Full-screen list → Full-screen detail === */}
                            <div className="lg:hidden">
                                {selectedContact ? (
                                    /* Mobile Detail View */
                                    <Card className="bg-white/[0.02] border-white/[0.06]">
                                        <CardHeader className="px-4 py-3 border-b border-white/[0.06]">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setSelectedContact(null)} className="p-1.5 text-white/40 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors min-h-9 min-w-9 flex items-center justify-center">
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold text-white truncate">{selectedContact.name}</h3>
                                                    <a href={`mailto:${selectedContact.email}`} className="text-xs text-fc-cyan truncate block">{selectedContact.email}</a>
                                                </div>
                                                <div className="flex gap-1">
                                                    {!selectedContact.read && (
                                                        <Button size="sm" variant="ghost" onClick={(e) => handleMarkAsRead(selectedContact.id, e)} className="text-white/40 hover:text-fc-cyan text-xs min-h-9">
                                                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Leído
                                                        </Button>
                                                    )}
                                                    <Button size="icon" variant="ghost" onClick={(e) => handleDelete(selectedContact.id, e)} className="text-red-400/40 hover:text-red-400 w-9 h-9">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 text-xs text-white/25 mb-4">
                                                <Clock className="w-3 h-3" />
                                                {new Date(selectedContact.created_at!).toLocaleString('es-PE')}
                                            </div>
                                            {selectedContact.service && (
                                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-300 border-0 text-[10px] uppercase tracking-wider mb-4">
                                                    Interesado en: {selectedContact.service}
                                                </Badge>
                                            )}
                                            <div className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                                                {selectedContact.message}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    /* Mobile List View */
                                    <Card className="bg-white/[0.02] border-white/[0.06]">
                                        <CardContent className="p-0 divide-y divide-white/[0.04]">
                                            {filteredContacts.map(contact => (
                                                <div
                                                    key={contact.id}
                                                    className="w-full text-left p-3.5 flex items-start gap-3 hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <button onClick={() => handleSelectContact(contact)} className="flex items-start gap-3 flex-1 min-w-0 text-left">
                                                        <div className="relative shrink-0">
                                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold capitalize ${!contact.read ? 'bg-fc-blue/20 text-fc-cyan-light' : 'bg-white/[0.05] text-white/30'}`}>
                                                                {contact.name.charAt(0)}
                                                            </div>
                                                            {!contact.read && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-fc-cyan border-2 border-[#0d0d1a] rounded-full" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-center mb-0.5">
                                                                <h4 className={`text-sm truncate pr-2 ${!contact.read ? 'font-semibold text-white' : 'text-white/60'}`}>
                                                                    {contact.name}
                                                                </h4>
                                                                <span className="text-[10px] text-white/20 whitespace-nowrap shrink-0">
                                                                    {new Date(contact.created_at!).toLocaleDateString('es-PE', { month: 'short', day: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <p className={`text-xs line-clamp-1 ${!contact.read ? 'text-white/50' : 'text-white/25'}`}>
                                                                {contact.message}
                                                            </p>
                                                        </div>
                                                    </button>
                                                    <button onClick={(e) => handleDelete(contact.id, e)} className="p-2 text-red-400/30 hover:text-red-400 transition-colors shrink-0 min-h-9 min-w-9 flex items-center justify-center">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* === DESKTOP: Split pane (lg+) === */}
                            <div className="hidden lg:grid grid-cols-3 gap-5 h-[calc(100vh-200px)]">
                                {/* Inbox List */}
                                <Card className="col-span-1 bg-white/[0.02] border-white/[0.06] flex flex-col overflow-hidden">
                                    <CardHeader className="px-4 py-3 border-b border-white/[0.06] shrink-0">
                                        <CardTitle className="text-sm font-semibold text-white">
                                            Mensajes
                                            <span className="ml-2 text-xs font-normal text-white/30">({filteredContacts.length})</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 overflow-y-auto flex-1 no-scrollbar">
                                        <div className="divide-y divide-white/[0.04]">
                                            {filteredContacts.map(contact => (
                                                <div
                                                    key={contact.id}
                                                    className={`group flex items-start gap-3 pr-2 hover:bg-white/[0.03] transition-colors border-l-2 ${selectedContact?.id === contact.id ? 'bg-white/[0.04] border-fc-cyan' : 'border-transparent'}`}
                                                >
                                                    <button
                                                        onClick={() => handleSelectContact(contact)}
                                                        className="p-4 flex items-start gap-3 flex-1 min-w-0 text-left"
                                                    >
                                                        <div className="relative shrink-0">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold capitalize ${!contact.read ? 'bg-fc-blue/20 text-fc-cyan-light' : 'bg-white/[0.05] text-white/30'}`}>
                                                                {contact.name.charAt(0)}
                                                            </div>
                                                            {!contact.read && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-fc-cyan border-2 border-[#0d0d1a] rounded-full" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-center mb-0.5">
                                                                <h4 className={`text-sm truncate pr-2 ${!contact.read ? 'font-semibold text-white' : 'text-white/60'}`}>{contact.name}</h4>
                                                                <span className="text-[10px] text-white/20 whitespace-nowrap">{new Date(contact.created_at!).toLocaleDateString('es-PE', { month: 'short', day: 'numeric' })}</span>
                                                            </div>
                                                            <p className="text-xs text-white/25 truncate mb-0.5">{contact.email}</p>
                                                            <p className={`text-xs line-clamp-1 ${!contact.read ? 'text-white/50' : 'text-white/25'}`}>{contact.message}</p>
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(contact.id, e)}
                                                        className="p-1.5 text-red-400/0 group-hover:text-red-400/40 hover:!text-red-400 transition-colors rounded-md hover:bg-red-400/[0.06] mt-4 self-start"
                                                        title="Eliminar mensaje"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Detail Panel */}
                                <Card className="col-span-2 bg-white/[0.02] border-white/[0.06] flex flex-col overflow-hidden">
                                    {selectedContact ? (
                                        <>
                                            <div className="p-5 border-b border-white/[0.06] flex justify-between items-start shrink-0">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] text-white/40 flex items-center justify-center text-lg font-bold capitalize">
                                                        {selectedContact.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white">{selectedContact.name}</h3>
                                                        <div className="flex items-center gap-2 text-xs text-white/30 mt-0.5">
                                                            <a href={`mailto:${selectedContact.email}`} className="text-fc-cyan hover:underline">{selectedContact.email}</a>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(selectedContact.created_at!).toLocaleString('es-PE')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {!selectedContact.read && (
                                                        <Button size="sm" variant="ghost" onClick={(e) => handleMarkAsRead(selectedContact.id, e)} className="text-white/40 hover:text-fc-cyan text-xs">
                                                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Marcar Leído
                                                        </Button>
                                                    )}
                                                    <Button size="sm" variant="ghost" onClick={(e) => handleDelete(selectedContact.id, e)} className="text-red-400/40 hover:text-red-400 text-xs">
                                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Eliminar
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => setSelectedContact(null)} className="text-white/25 hover:text-white w-8 h-8">
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="p-5 overflow-y-auto flex-1 no-scrollbar">
                                                {selectedContact.service && (
                                                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-300 border-0 text-[10px] uppercase tracking-wider mb-4">
                                                        Interesado en: {selectedContact.service}
                                                    </Badge>
                                                )}
                                                <div className="text-sm text-white/60 whitespace-pre-wrap leading-relaxed max-w-prose">
                                                    {selectedContact.message}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                                                <Mail className="w-6 h-6 text-white/15" />
                                            </div>
                                            <h3 className="text-sm font-medium text-white/40 mb-1">Ningún mensaje seleccionado</h3>
                                            <p className="text-xs text-white/20">Selecciona un mensaje de la lista para leerlo</p>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}
